REPORTER ?= spec

# Specify a specific order for test files..
TESTS = ./tests/help/index.test.js \
        ./tests/list.test.js \
        ./tests/search.test.js \
        ./tests/init.test.js \
        ./tests/install/install.test.js \
        ./tests/install/backend.test.js \
        ./tests/install/frontend.test.js \
        ./tests/remove.test.js \
        ./tests/generate/backend/controllers.test.js \
        ./tests/generate/backend/models.test.js \
        ./tests/generate/backend/services.test.js \
        ./tests/generate/backend/tasks.test.js \
        ./tests/generate/backend/tests.test.js \
        ./tests/generate/frontend/index.test.js \
        ./tests/scaffold/backend.test.js \
        ./tests/scaffold/frontend.test.js \
        ./tests/new/backend.test.js \
        ./tests/new/frontend.test.js \
        ./tests/repl.test.js \
        ./tests/downgrade.test.js \
        ./tests/upgrade.test.js \
        ./tests/setup.test.js

tests:
	@export NO_UPDATE_NOTIFIER=true
	@bower cache clean
	@npm cache clean
	@rm -rf ~/.config/configstore/update-notifier-cleverstack-cli.yml
	@./node_modules/mocha/bin/mocha --no-timeouts --globals setImmediate,clearImmediate --check-leaks --colors -t 0 -b --reporter ${REPORTER} ${TESTS}

test: tests

.PHONY: test tests
