import fs from 'fs';
const mainTsPath = 'src/main.ts';
let content = fs.readFileSync(mainTsPath, 'utf-8');

// Add router import if not already present
if (
  !content.includes("import router from './router';") &&
  !content.includes('import router from "./router";')
) {
  const importPattern = /import App from '.\/App.vue';|import App from ".\/App.vue";/;
  if (importPattern.test(content)) {
    content = content.replace(
      importPattern,
      `import App from './App.vue';\nimport router from './router';`
    );
  } else {
    // Fallback if App import is not found, add at the top
    content = `import router from './router';\n${content}`;
  }
}

// Add .use(router) before .mount('#app')
const mountPattern = /\.mount\('#app'\);|\.mount\("#app"\);/;
const usePiniaPattern = /\.use\(pinia\)/; // Assuming pinia is 'pinia'
const useVueQueryPattern = /\.use\(VueQueryPlugin, vueQueryPluginOptions\)/; // Example, adjust if different

if (!content.includes('.use(router)')) {
  if (useVueQueryPattern.test(content)) {
    content = content.replace(
      useVueQueryPattern,
      '.use(VueQueryPlugin, vueQueryPluginOptions)\n  .use(router)'
    );
  } else if (usePiniaPattern.test(content)) {
    content = content.replace(usePiniaPattern, '.use(pinia)\n  .use(router)');
  } else {
    content = content.replace(mountPattern, ".use(router)\n  .mount('#app');");
  }
}

fs.writeFileSync(mainTsPath, content);
console.log('Updated src/main.ts successfully.');
