/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "import",
        "boundaries",
        "react",
        "react-hooks",
        "jsx-a11y",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "next/core-web-vitals",
    ],
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            typescript: {},
        },
        "boundaries/elements": [
            { type: "app", pattern: "app/**" },
            { type: "components", pattern: "components/**" },
            { type: "lib", pattern: "lib/**" },
            { type: "server", pattern: "server/**" },
            { type: "admin", pattern: "app/admin/**" },
        ],
    },
    rules: {
        /* =========================
               TypeScript Hard Rules
               ========================= */

        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports" },
        ],
        "@typescript-eslint/no-non-null-assertion": "error",

        /* =========================
               Import & Dependency Rules
               ========================= */

        "import/no-default-export": "error",
        "import/no-cycle": "error",
        "import/order": [
            "error",
            {
                groups: ["builtin", "external", "internal"],
                "newlines-between": "always",
            },
        ],

        /* =========================
               Architecture Boundaries
               ========================= */

        "boundaries/element-types": [
            "error",
            {
                default: "disallow",
                rules: [
                    {
                        from: "app",
                        allow: ["components", "lib"],
                    },
                    {
                        from: "components",
                        allow: ["components", "lib"],
                    },
                    {
                        from: "server",
                        allow: ["lib"],
                    },
                    {
                        from: "admin",
                        allow: ["admin", "components", "lib", "server"],
                    },
                ],
            },
        ],

        /* =========================
               Client-Side Discipline
               ========================= */

        "react/jsx-no-useless-fragment": "error",
        "react/no-array-index-key": "error",

        /* Prevent accidental heavy logic in client */
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: ["@/server/*"],
                        message:
                            "Server logic must not be imported into client or public routes.",
                    },
                ],
            },
        ],

        /* =========================
               SEO & Markup Quality
               ========================= */

        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/no-static-element-interactions": "error",
        "jsx-a11y/alt-text": "error",

        /* =========================
               React / Next.js Rules
               ========================= */

        "react/react-in-jsx-scope": "off",
        "react-hooks/exhaustive-deps": "error",

        /* =========================
               Cost & Performance Signals
               ========================= */

        "no-console": ["warn", { allow: ["error"] }],
        "no-debugger": "error",
    },
    overrides: [
        {
            files: ["app/**/page.tsx"],
            rules: {
                "import/no-default-export": "off", // Next.js requires default export
            },
        },
        {
            files: ["app/api/**"],
            rules: {
                "no-console": "off", // API logging allowed
            },
        },
    ],
    //  Block heavy libraries globally

    "no-restricted-imports": [
        "error",
        {
            paths: [
                {
                    name: "lodash",
                    message: "Avoid heavy utility libraries on public routes.",
                },
            ],
        },
    ],
};
