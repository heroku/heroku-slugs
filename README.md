# Heroku Slugs CLI Plugin

This plugin adds commands to the Heroku CLI for downloading slugs

## To Install

```
$ heroku plugins:install heroku-slugs
```

## Commands

```
$ heroku slugs:download [SLUG_ID]
$ heroku slugs:download -a appname
```

This will download the Slug directly from our filestore on S3
