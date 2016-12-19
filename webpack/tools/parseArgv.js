const validArgvs = ['env'];

export default function parseArgv(argv) {
    let params = {};

    for (let i = 0, len = argv.length; i < len; i++) {
        let param = /--(.*)=/.exec(argv[i]);

        if (param && validArgvs.indexOf(param[1]) >= 0) {
            let key = param[1];
            let value = argv[i].split('=')[1];

            params[key] = value;
        }
    }

    return params;
}
