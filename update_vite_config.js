import fs from 'fs';
import path from 'path';

const viteConfigPath = 'vite.config.ts';
if (!fs.existsSync(viteConfigPath)) {
  console.error('vite.config.ts not found. Cannot update aliases.');
  process.exit(1);
}

let content = fs.readFileSync(viteConfigPath, 'utf-8');

// Add import for 'path' if not already there
if (
  !content.includes("import path from 'path';") &&
  !content.includes('import path from "path";')
) {
  content = 'import path from "path";\n' + content;
}

// Ensure resolve.alias block exists and contains the '@' alias
const aliasBlockContent = "'@': path.resolve(__dirname, './src')";

if (content.includes('resolve: {')) {
  if (content.includes('alias: {')) {
    // If 'alias' block exists, check if '@' is defined
    if (!content.match(/['"]@['"]\s*:/)) {
      // Add '@' alias to existing alias block
      content = content.replace('alias: {', `alias: {\n      ${aliasBlockContent},`);
    }
    // If '@' is already there, assume it's correct for now or will be handled by user if different.
  } else {
    // 'resolve' exists, but 'alias' does not. Add 'alias' with '@'.
    content = content.replace(
      'resolve: {',
      `resolve: {\n    alias: {\n      ${aliasBlockContent}\n    },`
    );
  }
} else {
  // 'resolve' block does not exist. Add it along with 'alias'.
  // Find 'plugins: [vue()]' to insert 'resolve' block after it.
  const pluginRegex = /(plugins: \[[^]*?\]),?/;
  const match = content.match(pluginRegex);
  if (match && match[0]) {
    content = content.replace(
      match[0],
      `${match[0]}\n  resolve: {\n    alias: {\n      ${aliasBlockContent}\n    }\n  },`
    );
  } else {
    // Fallback: try to insert before defineConfig closing '})'
    const defineConfigEnd = content.lastIndexOf('})');
    if (defineConfigEnd !== -1) {
      content =
        content.slice(0, defineConfigEnd) +
        `,\n  resolve: {\n    alias: {\n      ${aliasBlockContent}\n    }\n  }\n` +
        content.slice(defineConfigEnd);
    } else {
      console.warn(
        'Could not find a clear place to insert resolve.alias. Appending might be malformed.'
      );
      // This is a very last resort and might lead to syntax errors.
      content += `\nimport { defineConfig } from 'vite';\nexport default defineConfig({\n  resolve: {\n    alias: {\n      ${aliasBlockContent}\n    }\n  }\n});`;
    }
  }
}

fs.writeFileSync(viteConfigPath, content);
console.log('--- vite.config.ts (after potential modification) ---');
console.log(fs.readFileSync(viteConfigPath, 'utf-8'));
