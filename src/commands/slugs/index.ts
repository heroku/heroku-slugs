import type * as Heroku from '@heroku-cli/schema'

import {Command, flags} from '@heroku-cli/command'
import * as color from '@heroku/heroku-cli-util/color'
import {styledHeader} from '@heroku/heroku-cli-util/hux'
import {ux} from '@oclif/core/ux'

export default class SlugsIndex extends Command {
  static description = 'list recent slugs on application'
  static examples = [
    '$ heroku slugs --app myapp',
  ]
  static flags = {
    app: flags.app({required: true}),
    remote: flags.remote(),
  }

  async run() {
    const {flags} = await this.parse(SlugsIndex)
    const {app} = flags
    const {body: releases} = await this.heroku.get<Heroku.Release[]>(`/apps/${app}/releases`, {
      headers: {
        Range: 'version ..; order=desc',
      },
    })
    styledHeader(`${color.app(app)} Slugs`)
    for (const r of releases.filter(r => r.slug)) ux.stdout(`v${r.version}: ${r.slug?.id}`)
  }
}
