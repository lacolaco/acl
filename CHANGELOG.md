# Changelog

## [1.5.0](https://github.com/lacolaco/acl/compare/v1.4.0...v1.5.0) (2025-10-10)


### Features

* add readonly modifier for function definitions ([#41](https://github.com/lacolaco/acl/issues/41)) ([c1ab161](https://github.com/lacolaco/acl/commit/c1ab1615f4ac0e2165cd828cd3eebc028f1d1f30))
* introduce .acl/config.md with XML tag format for project ACL definitions ([#43](https://github.com/lacolaco/acl/issues/43)) ([c8854cf](https://github.com/lacolaco/acl/commit/c8854cf4089cc01db1f2321f361952796158b20d))

## [1.4.0](https://github.com/lacolaco/acl/compare/v1.3.4...v1.4.0) (2025-10-09)


### Features

* make ACL specification agent-agnostic ([#39](https://github.com/lacolaco/acl/issues/39)) ([a0b8690](https://github.com/lacolaco/acl/commit/a0b8690d582dd281fbab2376e27c8eebb84117ea)), closes [#38](https://github.com/lacolaco/acl/issues/38)

## [1.3.4](https://github.com/lacolaco/acl/compare/v1.3.3...v1.3.4) (2025-10-08)


### Bug Fixes

* remove spec object from core ACL documentation ([#36](https://github.com/lacolaco/acl/issues/36)) ([b874836](https://github.com/lacolaco/acl/commit/b8748367021091c0d39f8a043464d1677f686582))

## [1.3.3](https://github.com/lacolaco/acl/compare/v1.3.2...v1.3.3) (2025-10-08)


### Bug Fixes

* add cwd option to findUp for correct ACL.md resolution in npx environment ([#32](https://github.com/lacolaco/acl/issues/32)) ([f1c713b](https://github.com/lacolaco/acl/commit/f1c713b6286b612ce3a76a6f0d38d7137042b093))

## [1.3.2](https://github.com/lacolaco/acl/compare/v1.3.1...v1.3.2) (2025-10-08)


### Bug Fixes

* improve ACL.md path resolution and add caching ([#30](https://github.com/lacolaco/acl/issues/30)) ([154b502](https://github.com/lacolaco/acl/commit/154b502f3605eb96f42c481778afabbafb13c79c))

## [1.3.1](https://github.com/lacolaco/acl/compare/v1.3.0...v1.3.1) (2025-10-08)


### Bug Fixes

* add executable hashbang and extract server factory ([#27](https://github.com/lacolaco/acl/issues/27)) ([f12f473](https://github.com/lacolaco/acl/commit/f12f47304680cf822b98bd4ccae9b0c61e53c75d))

## [1.3.0](https://github.com/lacolaco/acl/compare/v1.2.0...v1.3.0) (2025-10-08)


### Features

* add build check to CI workflow and cleanup dependencies ([#24](https://github.com/lacolaco/acl/issues/24)) ([ee41073](https://github.com/lacolaco/acl/commit/ee410734647488120a66a616bec4dd2155dc3e12))


### Bug Fixes

* update package.json bin to single executable format and improve begin() workflow ([#26](https://github.com/lacolaco/acl/issues/26)) ([130cf62](https://github.com/lacolaco/acl/commit/130cf62ecb074f5ca5a58d017aa5df5dd305d5ec))

## [1.2.0](https://github.com/lacolaco/acl/compare/v1.1.0...v1.2.0) (2025-10-08)


### Features

* enhance MCP server discoverability with comprehensive instructions and resources ([#22](https://github.com/lacolaco/acl/issues/22)) ([3366a51](https://github.com/lacolaco/acl/commit/3366a51ad00b0ddcf70ef6349839370cb00140fc))

## [1.1.0](https://github.com/lacolaco/acl/compare/v1.0.2...v1.1.0) (2025-10-08)


### Features

* add get_acl_specification tool and modular architecture ([#13](https://github.com/lacolaco/acl/issues/13)) ([c5e15ef](https://github.com/lacolaco/acl/commit/c5e15ef87df55bbadbc628079682155151a26f00))
* enhance ACL specification with detailed object definitions ([#15](https://github.com/lacolaco/acl/issues/15)) ([0b8d96d](https://github.com/lacolaco/acl/commit/0b8d96dbf800cadf7a9d4cc129e28a7f3117a40a))


### Bug Fixes

* add repository field to package.json for provenance validation ([#12](https://github.com/lacolaco/acl/issues/12)) ([c12a17d](https://github.com/lacolaco/acl/commit/c12a17dfc1ee8af24449f4c0ed4e63605f81a7eb))
* **ci:** add workflow_dispatch for manual publishing ([#8](https://github.com/lacolaco/acl/issues/8)) ([30d4fc8](https://github.com/lacolaco/acl/commit/30d4fc8acbb2086db6e785659b71cc74c9c16ea4))
* **ci:** install npm 11.15.1+ and remove pnpm version duplication ([#11](https://github.com/lacolaco/acl/issues/11)) ([deae62d](https://github.com/lacolaco/acl/commit/deae62dd70aa7803c07c5575ac2fb738eecc9454))
* **ci:** update GitHub Actions to latest versions ([#10](https://github.com/lacolaco/acl/issues/10)) ([c56696b](https://github.com/lacolaco/acl/commit/c56696b06fe5d36c4b5f110a0f725e4a9bc3ecf8))

## [1.0.2](https://github.com/lacolaco/acl/compare/v1.0.1...v1.0.2) (2025-10-08)


### Bug Fixes

* **ci:** remove npm upgrade step to avoid permission errors ([#6](https://github.com/lacolaco/acl/issues/6)) ([f9e4a8d](https://github.com/lacolaco/acl/commit/f9e4a8d5294fb99d8814e81a0ab7008ccc7ee42a))

## [1.0.1](https://github.com/lacolaco/acl/compare/v1.0.0...v1.0.1) (2025-10-08)


### Bug Fixes

* **ci:** add write permissions to publish job ([#4](https://github.com/lacolaco/acl/issues/4)) ([88caba5](https://github.com/lacolaco/acl/commit/88caba539469d46a0c68e3767499556d3feea5b8))

## 1.0.0 (2025-10-08)


### Bug Fixes

* revert version to 0.0.1 and update publishConfig ([1f79f41](https://github.com/lacolaco/acl/commit/1f79f4152828345a4a83eb50c1ad3f76e796dd1d))
* setup npm publishing with OIDC and release-please ([#2](https://github.com/lacolaco/acl/issues/2)) ([d974c78](https://github.com/lacolaco/acl/commit/d974c78a3b5603d2bfcec2c8c4d2cfadff6b1eb6))
