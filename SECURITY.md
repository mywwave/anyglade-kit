# Security policy

## Supported versions

Security fixes go into the latest published minor version of `@anyglade/kit`.

## Reporting a vulnerability

Do not open a public issue. Report it privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**.

Include what is affected, how to reproduce it and the impact you see. You will get an answer within a few days. Once a fix is released, the advisory is published with credit to you unless you ask otherwise.

## Supply chain

- The package is published from CI through npm trusted publishing. No npm token is stored in the repository.
- Dependabot keeps GitHub Actions and dependencies up to date, and CodeQL scans the code.
- The `postinstall` script only links the bundled design skill for AI agents into your project. It never downloads anything.
