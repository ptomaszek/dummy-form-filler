# Change Log
The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and [Semantic Versioning](http://semver.org/).

## [1.4.0] - 2023-10-08
### Changed
- Migrated to Manifest v3 (different setup for Chrome and Firefox)

## [1.3.2] - 2020-05-23
### Changed
- Updated libs

## [1.3.1] - 2019-10-24
### Changed
- Updated libs
### Fixed
- Disabled picking of select's option that has empty value. See #23 
- Removed source map declaration from .js. See #25

## [1.3.0] - 2019-01-17
### Added
- Configuration with node & npm
### Changed
- Update libs
### Fixed
- Fix populating input element having no 'type' attr (it's assumed to be of type=text by default). See #21
- Fix maxlength in <textarea>. See #22

## [1.2.3] - 2017-09-23
### Fixed
- Disabled the plugin for pages ending with '.xml'. See #20
### Changed
- Updated jQuery to the latest version
- web-ext reference in README

## [1.2.0] - 2017-04-13
### Added
- Key shortcut

## [1.1.0] - 2016-11-09
### Added
- Publish 'change' event (indirect support for AngularJS and possibly other frameworks)

## [1.0.0] - 2016-08-21
### Added
- Changelog file
- Chrome support
- Options

### Changed
- Extension rewritten from Add-on SDK to WebExtensions
- Logic around radio buttons
- show.html file (for dev purposes)
