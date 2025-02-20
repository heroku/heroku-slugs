import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {Args, ux} from '@oclif/core'
import {execSync} from 'node:child_process'

import {download} from '../../lib/download'

export default class SlugsDownload extends Command {
  static args = {
    slug: Args.string({description: 'name or ID of slug'}),
  }

  static description = "download a slug's tarball to <APP_NAME>/slug.tar.gz and then extract the slug"

  static examples = [
    '$ heroku slugs:download --app example-app v2',
    '$ heroku slugs:download --app example-app v2 --no-extract-slug',
  ]

  static flags = {
    app: flags.app({required: true}),
    'no-extract-slug': flags.boolean({char: 'e', default: false, description: 'skip extracting slug after download'}),
    remote: flags.remote(),
  }

  async run() {
    const {args, flags} = await this.parse(SlugsDownload)
    const {app} = flags
    const {slug} = args
    const noExtractSlug = flags['no-extract-slug']

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
      ux.error('No slug found. Specify the slug to download by its name or ID.')
    }

    const {body: appSlug} = await this.heroku.get<Heroku.Slug>(`/apps/${app}/slugs/${id}`)
    if (!appSlug.blob || !appSlug.blob.url) {
      this.error('This slug has no blob to download.')
    }

    ux.log(`Downloading slug ${id} to ${app}/slug.tar.gz`)
    execSync(`mkdir ${app}`)
    await download(appSlug.blob.url, `${app}/slug.tar.gz`, {progress: true})

    if (!noExtractSlug) {
      ux.action.start(`Extracting ${app}/slug.tar.gz`)
      execSync(`tar -xf ${app}/slug.tar.gz -C ${app}`)
      ux.action.stop()
    }
  }
}
