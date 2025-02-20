import color from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {ux} from '@oclif/core'

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
    ux.styledHeader(`${color.app(app)} Slugs`)
    for (const r of releases.filter(r => r.slug)) ux.log(`v${r.version}: ${r.slug?.id}`)
  }
}
