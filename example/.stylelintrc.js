module.exports = {
    "extends": [
        "stylelint-config-standard",
        "stylelint-config-hudochenkov/order"
    ],
    "defaultSeverity": "warning",
    "plugins": [
        "stylelint-order"
    ],
    "customSyntax": "postcss-scss",
    "rules": {
        "selector-max-id": 1,
        "color-hex-length": null,
        "color-named": "never",
        "selector-class-pattern": null,
        "keyframes-name-pattern": null,
        "import-notation": "string",
        "selector-pseudo-class-no-unknown": [
            true,
            {
                "ignorePseudoClasses": [
                    "global",
                    "local"
                ]
            }
        ],
        "at-rule-no-unknown": [
            true,
            {
                "ignoreAtRules": [
                    "include",
                    "extend",
                    "mixin",
                    "for",
                    "if"
                ]
            }
        ],
        "function-no-unknown": [
            true,
            {
                "ignoreFunctions":
                    [
                        "transparentize",
                        "darken"
                    ]
            }
        ]
    }
};
