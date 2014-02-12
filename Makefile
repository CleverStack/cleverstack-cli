REPORTER ?= spec

# Specify a specific order for test files..
TESTS = ./tests/help/help.test.js \
        ./tests/help/build.test.js \
        ./tests/help/downgrade.test.js \
        ./tests/help/generate.test.js \
        ./tests/help/init.test.js \
        ./tests/help/install.test.js \
        ./tests/help/list.test.js \
        ./tests/help/new.test.js \
        ./tests/help/remove.test.js \
        ./tests/help/scaffold.test.js \
        ./tests/help/setup.test.js \
        ./tests/help/server.test.js \
        ./tests/help/test.test.js \
        ./tests/help/upgrade.test.js \
        ./tests/list.test.js \
        ./tests/search.test.js \
        ./tests/init/init.test.js \
        ./tests/init/backend.test.js \
        ./tests/init/frontend.test.js \
        ./tests/install/install.test.js \
        ./tests/install/backend.test.js \
        ./tests/install/frontend.test.js \
        ./tests/remove.test.js \
        ./tests/generate/backend/controllers.test.js \
        ./tests/generate/backend/models.test.js \
        ./tests/generate/backend/services.test.js \
        ./tests/generate/backend/tasks.test.js \
        ./tests/generate/backend/tests.test.js \
        ./tests/generate/frontend/controllers.test.js \
        ./tests/generate/frontend/directives.test.js \
        ./tests/generate/frontend/factories.test.js \
        ./tests/generate/frontend/services.test.js \
        ./tests/generate/frontend/views.test.js \
        ./tests/scaffold/backend.test.js \
        ./tests/scaffold/frontend.test.js \
        ./tests/new/backend.test.js \
        ./tests/new/frontend.test.js \
        ./tests/repl.test.js \
        ./tests/downgrade.test.js \
        ./tests/upgrade.test.js \
        ./tests/setup.test.js

tests:
	@./node_modules/mocha/bin/mocha --globals setImmediate,clearImmediate --check-leaks --colors -t 0 -b --reporter ${REPORTER} ${TESTS}

test: tests

.PHONY: test tests
