# Change Log

## 1.1.0
- `v-get` helper

#### Upgrade Notes
When upgrading, you will need to run `ember install ember-cp-validations` again or run the generator `ember g ember-cp-validations` after upping the version in `package.json`.

## 1.0.2
- Fixed an issue where if a result was undefined or null, it would update the validation result to false but would continue to go down the chain on get

## 1.0.1
- **BREAKING CHANGE** - confirmation rework - [issue](https://github.com/offirgolan/ember-cp-validations/issues/4)
- isInvalid helper - [issue](https://github.com/offirgolan/ember-cp-validations/issues/2)
- fixed lodash error - [issue](https://github.com/offirgolan/ember-cp-validations/issues/3)

## 1.0.0
- Initial Release
