const LAYOUT_ELEMENTS = new Set([
  "div",
  "span",
  "section",
  "article",
  "aside",
  "main",
  "nav",
  "header",
  "footer",
  "form",
  "fieldset",
  "label",
  "ul",
  "ol",
  "li",
]);

const TEXT_ELEMENTS = new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p"]);

const TYPOGRAPHY_UTILITY =
  /(^|\s)(\w+:)*(text-(xs|sm|base|lg|xl|\dxl)|font-(thin|light|normal|medium|semibold|bold|black)|leading-\S+|tracking-\S+)(\s|$)/;

const SPACING_UTILITY =
  /(^|\s)(\w+:)*-?(p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y)-(?!auto(\s|$))\S+/;

const FOREIGN_SOURCES = new Set(["@heroui/react", "@heroui/styles", "@gravity-ui/icons"]);

function classNameLiteral(attribute) {
  if (attribute.name?.name !== "className") {
    return null;
  }
  const { value } = attribute;
  if (value?.type === "Literal") {
    return value.value;
  }
  const expression = value?.type === "JSXExpressionContainer" ? value.expression : null;
  if (expression?.type === "TemplateLiteral") {
    return expression.quasis.map((quasi) => quasi.value.raw).join(" ");
  }
  return expression?.type === "Literal" ? expression.value : null;
}

function classNameRule(description, message, matches) {
  return {
    meta: { type: "problem", docs: { description }, schema: [], messages: { invalid: message } },
    create(context) {
      return {
        JSXAttribute(node) {
          const value = classNameLiteral(node);
          if (typeof value === "string" && matches(value)) {
            context.report({ node, messageId: "invalid" });
          }
        },
      };
    },
  };
}

const noRawLayout = {
  meta: {
    type: "problem",
    docs: { description: "Disallow raw layout elements in favor of <Box />" },
    schema: [],
    messages: { invalid: 'Use <Box as="{{ element }}" /> from @anyglade/kit.' },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const element = node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (element && LAYOUT_ELEMENTS.has(element)) {
          context.report({ node, messageId: "invalid", data: { element } });
        }
      },
    };
  },
};

const noRawText = {
  meta: {
    type: "problem",
    docs: { description: "Disallow raw text elements in favor of <Text />" },
    schema: [],
    messages: { invalid: 'Use <Text as="{{ element }}" /> from @anyglade/kit.' },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        const element = node.name.type === "JSXIdentifier" ? node.name.name : null;
        if (element && TEXT_ELEMENTS.has(element)) {
          context.report({ node, messageId: "invalid", data: { element } });
        }
      },
    };
  },
};

const noForeignImport = {
  meta: {
    type: "problem",
    docs: { description: "Import UI only through @anyglade/kit" },
    schema: [],
    messages: {
      invalid: "Import from @anyglade/kit or @anyglade/kit/icons instead of {{ source }}.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (FOREIGN_SOURCES.has(source)) {
          context.report({ node, messageId: "invalid", data: { source } });
        }
      },
    };
  },
};

export default {
  meta: { name: "anyglade" },
  rules: {
    "no-raw-layout": noRawLayout,
    "no-raw-text": noRawText,
    "no-foreign-import": noForeignImport,
    "no-typography-utility": classNameRule(
      "Disallow typography utilities",
      "Use a <Text /> variant instead of Tailwind typography utilities.",
      (value) => TYPOGRAPHY_UTILITY.test(value),
    ),
    "no-spacing-utility": classNameRule(
      "Disallow spacing utilities",
      "Use <Box /> spacing props instead of Tailwind spacing utilities.",
      (value) => SPACING_UTILITY.test(value),
    ),
    "no-dark-variant": classNameRule(
      "Disallow dark: variants",
      "Tokens resolve light and dark automatically. Remove the dark: variant.",
      (value) => /(^|\s)dark:/.test(value),
    ),
    "no-arbitrary-value": classNameRule(
      "Disallow arbitrary Tailwind values",
      "Use a design token instead of an arbitrary value.",
      (value) => /-\[[^\]]+\]/.test(value),
    ),
  },
};
