`heroku slugs`
==============

manage and download slugs

* [`heroku slugs`](#heroku-slugs)
* [`heroku slugs:download [SLUG]`](#heroku-slugsdownload-slug)

## `heroku slugs`

list recent slugs on application

```
USAGE
  $ heroku slugs -a <value> [--prompt] [-r <value>]

FLAGS
  -a, --app=<value>     (required) [env: HEROKU_APP] app to run command against
  -r, --remote=<value>  git remote of app to use

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  list recent slugs on application

EXAMPLES
  $ heroku slugs --app myapp
```

_See code: [src/commands/slugs/index.ts](https://github.com/heroku/heroku-slugs/blob/heroku-slugs-v3.0.3/src/commands/slugs/index.ts)_

## `heroku slugs:download [SLUG]`

download a slug's tarball to <APP_NAME>/slug.tar.gz and then extract the slug

```
USAGE
  $ heroku slugs:download [SLUG] -a <value> [--prompt] [-e] [-r <value>]

ARGUMENTS
  [SLUG]  name or ID of slug

FLAGS
  -a, --app=<value>      (required) [env: HEROKU_APP] app to run command against
  -e, --no-extract-slug  don't extract slug after download
  -r, --remote=<value>   git remote of app to use

GLOBAL FLAGS
  --prompt  interactively prompt for command arguments and flags

DESCRIPTION
  download a slug's tarball to <APP_NAME>/slug.tar.gz and then extract the slug

EXAMPLES
  $ heroku slugs:download --app example-app v2

  $ heroku slugs:download --app example-app v2 --no-extract-slug
```

_See code: [src/commands/slugs/download.ts](https://github.com/heroku/heroku-slugs/blob/heroku-slugs-v3.0.3/src/commands/slugs/download.ts)_
