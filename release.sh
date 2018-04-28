#!/usr/bin/env bash

readonly VERSION=$(node -e "console.log(require('./package').version)")

git tag -a $VERSION -m "$VERSION"
git push origin --tags
