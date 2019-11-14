'use strict';

const
    { promisify } = require('util'),
    { readdirSync, statSync, readdir, stat } = require('fs'),
    { difference, filter } = require('lodash'),
    { join } = require('path'),
    Promise = require('bluebird');

const
    readdirPromise = promisify(readdir),
    statPromise = promisify(stat);

module.exports.walk = function *walk (dir) {
    const names = readdirSync(dir);
    const dirNames = filter(names, (name) => statSync(join(dir, name)).isDirectory());
    const fileNames = difference(names, dirNames);
    yield [dir, dirNames, fileNames];
    for (let i = 0; i < dirNames.length; i++) {
        yield* walk(join(dir, dirNames[i]));
    }
};

module.exports.walkAsync = function *walkAsync (dir) {
    let names, dirNames;
    yield readdirPromise(dir)
        .then((result) => {
            names = result;
            return Promise.map(names, (name) => statPromise(join(dir, name)));
        })
        .then((stats) => {
            dirNames = filter(names, (name, index) => stats[index].isDirectory());
            const fileNames = difference(names, dirNames);
            return [dir, dirNames, fileNames];
        });
    for (let i = 0; i < dirNames.length; i++) {
        yield* walkAsync(join(dir, dirNames[i]));
    }
};
