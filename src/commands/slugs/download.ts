import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {Args, ux} from '@oclif/core'
import {execSync} from 'node:child_process'

import {download} from '../../lib/download'

export default class SlugsDownload extends Command {
  static args = {
    slug: Args.string({description: 'slug ID or name of slug'}),
  }

  static description = 'downloads a slug to <APP_NAME>/slug.tar.gz and then extracts it'

  static examples = [
    '$ heroku slugs:download --app myapp v2',
  ]

  static flags = {
    app: flags.app({required: true}),
    remote: flags.remote(),
  }

  async run() {
    const {args, flags} = await this.parse(SlugsDownload)
    const {app} = flags
    const {slug} = args

    let id = slug
    if (!id) {
      const {body: releases} = await this.heroku.get<Heroku.Release[]>(`/apps/${app}/releases`, {
        headers: {
          Range: 'version ..; order=desc',
        },
      })
      const currentRelease = releases.find(r => r.slug)

      id = currentRelease?.slug?.id
    }

    if (!id) {
      ux.error('No slug found. Please specify which slug to download.')
    }

    const {body: appSlug} = await this.heroku.get<Heroku.Slug>(`/apps/${app}/slugs/${id}`)
    if (!appSlug.blob || !appSlug.blob.url) {
      this.error('This slug has no blob to download')
    }

    execSync(`mkdir ${app}`)
    await download(appSlug.blob.url, `${app}/slug.tar.gz`, {progress: true})
    execSync(`tar -xf ${app}/slug.tar.gz -C ${app}`)
  }
}
