REPORTER ?= spec

# Specify a specific order for test files..
TESTS = ./tests/help.test.js ./tests/list.test.js ./tests/search.test.js ./tests/init.test.js ./tests/install.test.js ./tests/remove.test.js ./tests/generate.test.js ./tests/scaffold.test.js ./tests/new.test.js ./tests/repl.test.js ./tests/downgrade.test.js ./tests/upgrade.test.js

tests:
	@./node_modules/mocha/bin/mocha --globals setImmediate,clearImmediate --check-leaks --colors -t 0 -b --reporter ${REPORTER} ${TESTS}

test: tests

.PHONY: test tests
