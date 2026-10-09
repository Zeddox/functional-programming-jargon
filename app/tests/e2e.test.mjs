import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0].split('#')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 5198;
server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}`);
  let exitCode = 0;
  let browser;

  try {
    const launchOptions = { headless: true };
    if (fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')) {
      launchOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
    browser = await chromium.launch(launchOptions);
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

    console.log('Running test 1: Direct hash navigation (#thunk)...');
    await page.goto(`http://localhost:${PORT}/#thunk`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const isPanelOpen = await page.locator('aside').isVisible();
    if (!isPanelOpen) throw new Error('Aside panel did not open on /#thunk');
    const title = await page.locator('aside h2').textContent();
    if (!title.toLowerCase().includes('thunk')) throw new Error(`Expected title Thunk, got: ${title}`);
    console.log('✓ Test 1 passed: /#thunk opened Thunk concept successfully.');

    console.log('Running test 2: Search and select concept...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    await page.keyboard.press('/');
    await page.waitForTimeout(300);

    const searchInput = page.locator('input[type="search"]');
    await searchInput.fill('thunk');
    await page.waitForTimeout(300);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(800);

    const panelAfterSearch = await page.locator('aside').isVisible();
    if (!panelAfterSearch) throw new Error('Aside panel did not open after search selection');
    const titleAfterSearch = await page.locator('aside h2').textContent();
    if (!titleAfterSearch.toLowerCase().includes('thunk')) throw new Error(`Expected title Thunk, got: ${titleAfterSearch}`);
    console.log('✓ Test 2 passed: Searching and selecting Thunk unfilters canvas and opens concept panel.');

    console.log('Running test 3: Root URL load without hash...');
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const isRootPanelOpen = await page.locator('aside').isVisible().catch(() => false);
    if (isRootPanelOpen) throw new Error('Aside panel should be closed on root / visit');
    if (!(await page.getByTestId('empty-state').isVisible())) throw new Error('Empty state should show when nothing is selected');

    // Esc and a click on empty canvas both clear the selection
    await page.goto(`http://localhost:${PORT}/#thunk`, { waitUntil: 'networkidle' });
    await page.waitForSelector('aside h2', { timeout: 5000 });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    if (await page.locator('aside').isVisible().catch(() => false)) throw new Error('Esc should close the panel');
    if (!(await page.getByTestId('empty-state').isVisible())) throw new Error('Esc should clear the selection');
    if (page.url().includes('#')) throw new Error(`Esc should clear the hash, got ${page.url()}`);

    await page.goto(`http://localhost:${PORT}/#thunk`, { waitUntil: 'networkidle' });
    await page.waitForSelector('aside h2', { timeout: 5000 });
    await page.mouse.click(12, 200);
    await page.waitForTimeout(300);
    if (await page.locator('aside').isVisible().catch(() => false)) throw new Error('Empty-canvas click should close the panel');
    if (!(await page.getByTestId('empty-state').isVisible())) throw new Error('Empty-canvas click should clear the selection');
    console.log('✓ Test 3 passed: Root URL shows the overview; Esc and empty-canvas clicks clear the selection.');

    console.log('Running test 4: Batch 3 direct hash navigation (#free-monad, #profunctor, #algebraic-effects)...');
    for (const term of ['free-monad', 'profunctor', 'algebraic-effects', 'semigroupoid', 'monad-transformer', 'traversal']) {
      await page.goto(`http://localhost:${PORT}/#${term}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const isTermOpen = await page.locator('aside').isVisible();
      if (!isTermOpen) throw new Error(`Aside panel failed to open for #${term}`);
      const termTitle = await page.locator('aside h2').textContent();
      console.log(`  ✓ #${term} loaded successfully: "${termTitle.trim()}"`);
    }

    console.log('Running test 5: Search for profunctor...');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    await page.keyboard.press('/');
    await page.waitForTimeout(200);
    await page.locator('input[type="search"]').fill('profunctor');
    await page.waitForTimeout(200);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);
    const profunctorOpen = await page.locator('aside').isVisible();
    if (!profunctorOpen) throw new Error('Profunctor panel failed to open from search');
    const profunctorTitle = await page.locator('aside h2').textContent();
    if (!profunctorTitle.toLowerCase().includes('profunctor')) throw new Error(`Expected Profunctor, got: ${profunctorTitle}`);
    console.log('✓ Test 5 passed: Profunctor ranked #1 in search and opened cleanly.');

    console.log('Running test 6: Mobile bottom sheet peek & expand...');
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobilePage.goto(`http://localhost:${PORT}/#thunk`, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(600);
    const mobileAside = mobilePage.locator('aside');
    if (!(await mobileAside.isVisible())) throw new Error('Mobile bottom sheet should be visible');
    const peekBox = await mobileAside.boundingBox();
    if (!peekBox || peekBox.y < 350) throw new Error('Mobile sheet should start in bottom peek mode');
    console.log('  ✓ Mobile sheet starts in bottom peek mode');

    // Click expand button
    const expandBtn = mobilePage.locator('aside button[title*="Expand"]');
    await expandBtn.click();
    await mobilePage.waitForTimeout(400);
    const expBox = await mobileAside.boundingBox();
    if (!expBox || expBox.y > 200) throw new Error('Mobile sheet should expand upwards');
    console.log('  ✓ Mobile sheet expands to full view');
    await mobilePage.close();
    console.log('✓ Test 6 passed: Mobile bottom sheet behavior verified.');

    console.log('Running test 7: Graph views widen for hidden terms...');
    const viewPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const checkedView = () => viewPage.locator('[role="radiogroup"] [aria-checked="true"]').textContent();
    await viewPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    if (!(await checkedView()).startsWith('Essentials')) throw new Error(`Default view should be Essentials, got ${await checkedView()}`);
    await viewPage.goto(`http://localhost:${PORT}/#yoneda-lemma`, { waitUntil: 'networkidle' });
    await viewPage.waitForSelector('aside h2', { timeout: 5000 });
    if (!(await checkedView()).startsWith('Everything')) throw new Error('A link to a niche term should switch to Everything');
    await viewPage.locator('[role="radio"]', { hasText: 'Practical' }).click();
    await viewPage.reload({ waitUntil: 'networkidle' });
    if (!(await checkedView()).startsWith('Everything')) throw new Error(`Hash term should keep the wider view after reload, got ${await checkedView()} at ${viewPage.url()}`);
    await viewPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    if (!(await checkedView()).startsWith('Everything')) throw new Error('The chosen view should be remembered');
    await viewPage.locator('[role="radio"]', { hasText: 'Practical' }).click();
    await viewPage.reload({ waitUntil: 'networkidle' });
    if (!(await checkedView()).startsWith('Practical')) throw new Error('Practical should be remembered');
    await viewPage.close();
    console.log('✓ Test 7 passed: Views default to Essentials, widen for niche links and are remembered.');

    console.log('Running test 8: Learning path start, step, pause and resume...');
    const pathPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await pathPage.goto(`http://localhost:${PORT}/#monad`, { waitUntil: 'networkidle' });
    await pathPage.waitForSelector('[data-testid="term-paths"]', { timeout: 5000 });
    const monadsPath = pathPage.locator('[data-testid="term-paths"] > div', { hasText: 'Functions to monads' });
    await monadsPath.getByRole('button', { name: 'From step 1' }).click();
    await pathPage.waitForSelector('[data-testid="path-step"]');
    let stepText = await pathPage.locator('[data-testid="path-step"]').textContent();
    if (!stepText.includes('Step 1 of 13')) throw new Error(`Expected step 1, got: ${stepText.slice(0, 80)}`);
    if (!(await pathPage.locator('aside h2').textContent()).includes('Function')) throw new Error('Step 1 should be Function');
    await pathPage.locator('[data-testid="path-controls"]').getByRole('button', { name: /Next/ }).click();
    await pathPage.waitForTimeout(200);
    if (!(await pathPage.locator('aside h2').textContent()).includes('Pure Function')) throw new Error('Next should go to Pure Function');
    if (!pathPage.url().endsWith('#pure-function')) throw new Error(`URL should follow the step, got ${pathPage.url()}`);

    // Esc pauses; the overview card offers to resume where we left off
    await pathPage.keyboard.press('Escape');
    await pathPage.waitForTimeout(300);
    const resume = pathPage.getByTestId('empty-state').getByRole('button', { name: /Resume Functions to monads · step 2\/13/ });
    if (!(await resume.isVisible())) throw new Error('Empty state should offer to resume the paused path');
    await pathPage.reload({ waitUntil: 'networkidle' });
    await resume.click();
    await pathPage.waitForSelector('[data-testid="path-step"]');
    stepText = await pathPage.locator('[data-testid="path-step"]').textContent();
    if (!stepText.includes('Step 2 of 13')) throw new Error('Resume should return to step 2 after a reload');

    // A path step that the current view hides still appears while on the path
    await pathPage.getByRole('button', { name: 'Learning paths' }).click();
    await pathPage.getByRole('dialog', { name: 'Learning paths' })
      .locator('li', { hasText: 'Category theory for C# developers' })
      .getByRole('button', { name: 'Start' }).click();
    await pathPage.waitForSelector('[data-testid="path-step"]');
    if (!(await pathPage.locator('aside h2').textContent()).includes('Category')) throw new Error('Category theory path should start at Category');
    await pathPage.close();
    console.log('✓ Test 8 passed: Paths start, advance, pause on Esc and resume after reload.');

    console.log('Running test 9: Try it and exercises in the in-browser C# runner...');
    const labPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await labPage.goto(`http://localhost:${PORT}/#functor`, { waitUntil: 'networkidle' });
    await labPage.click('[data-testid="try-it"]');
    await labPage.waitForSelector('[data-testid="codelab"]');
    const statusText = () => labPage.textContent('[data-testid="runner-status"]');
    const output = () => labPage.textContent('[data-testid="codelab-output"]');
    if (!fs.existsSync(path.join(distDir, 'runner/runner-client.js'))) {
      await labPage.waitForFunction(() => document.querySelector('[data-testid="runner-status"]')?.textContent.includes('isn’t built'));
      console.log('  (runner not built: checked the "not built" message only; run `npm run build:runner` for the full test)');
    } else {
      await labPage.waitForFunction(() => document.querySelector('[data-testid="runner-status"]')?.textContent.startsWith('Ready'), null, { timeout: 120000 });
      // The readme examples run, each `// =>` line printing its value
      await labPage.click('[data-testid="codelab-run"]');
      await labPage.waitForFunction(() => document.querySelector('[data-testid="codelab-output"]')?.textContent.includes('Some(4)'), null, { timeout: 60000 });
      // The exercise's starter runs but doesn't pass; the solution does
      await labPage.getByRole('tab', { name: /Shout without unwrapping/ }).click();
      await labPage.click('[data-testid="codelab-run"]');
      await labPage.waitForFunction(() => document.querySelector('[data-testid="codelab-output"]')?.textContent.includes('Not yet'), null, { timeout: 30000 });
      const solution = (await labPage.evaluate(() => fetch('data/jargons.json').then(r => r.json())))
        .terms.find(t => t.id === 'functor').exercises[0].solution;
      // Right output but unwrapped with Match: the exercise's rules say not yet
      const setCode = (code) => labPage.evaluate((c) => window.monaco.editor.getEditors()[0].setValue(c), code);
      await setCode(solution.replace('FindUser(id).Map(name => name.ToUpper())', 'FindUser(id).Match(name => Some(name.ToUpper()), () => None)'));
      await labPage.click('[data-testid="codelab-run"]');
      await labPage.waitForFunction(() => document.querySelector('[data-testid="codelab-output"]')?.textContent.includes('breaks one of the exercise’s rules'), null, { timeout: 30000 });
      await labPage.waitForSelector('[data-testid="exercise-rules"] li[data-state="broken"]');
      if (!(await labPage.locator('[data-testid="rule-diagnostic"][data-severity="error"]').count())) throw new Error('The console should list the broken rule');
      await setCode(solution);
      await labPage.click('[data-testid="codelab-run"]');
      await labPage.waitForFunction(() => document.querySelector('[data-testid="codelab-output"]')?.textContent.includes('Passed'), null, { timeout: 30000 });
      await labPage.waitForFunction(() => [...document.querySelectorAll('[data-testid="exercise-rules"] li')].every(li => li.dataset.state === 'kept'));
      if (!(await labPage.locator('[data-testid="rule-diagnostic"][data-severity="info"]').count())) throw new Error('Keeping the rules should earn the praise note');
      // Live diagnostics: a type error is listed without running
      await labPage.evaluate(() => window.monaco.editor.getEditors()[0].setValue('int x = "nope";'));
      await labPage.waitForFunction(() => document.querySelector('[data-testid="codelab-output"]')?.textContent.includes('CS0029'), null, { timeout: 30000 });
      // Esc closes the panel, and the drawer shows the exercise as passed
      await labPage.keyboard.press('Escape');
      await labPage.waitForSelector('[data-testid="codelab"]', { state: 'detached' });
      if (!(await labPage.locator('[data-testid="term-exercises"] [aria-label="Passed"]').count())) throw new Error('The drawer should show the exercise as passed');
      if (!(await labPage.locator('aside h2').isVisible())) throw new Error('Esc in the code panel should leave the drawer open');
    }
    await labPage.close();

    console.log(`✓ Test 9 passed: Try it runs the examples; an exercise fails with the starter or a broken rule and passes with the solution.`);

    console.log('Running test 10: Topic picker frames a topic and widens the view when needed...');
    const topicPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await topicPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await topicPage.evaluate(() => localStorage.removeItem('fp_view'));
    await topicPage.reload({ waitUntil: 'networkidle' });
    const topicView = () => topicPage.locator('[role="radiogroup"][aria-label="Graph view"] [aria-checked="true"]').textContent();
    if (!(await topicView()).startsWith('Essentials')) throw new Error('Should start in Essentials');
    const picker = topicPage.getByRole('combobox', { name: 'Topic' });
    if ((await picker.locator('option').count()) !== 9) throw new Error('The picker should list all 8 topics plus "All topics"');
    if (!(await picker.locator('option[value="lambda-calculus"]').textContent()).includes('in Practical')) throw new Error('A topic Essentials hides should say which view shows it');
    // A topic the view shows keeps the view
    await picker.selectOption('effects');
    if (!(await topicView()).startsWith('Essentials')) throw new Error('Effects is in Essentials; the view should stay');
    // A topic it hides widens to the next view that has it
    await picker.selectOption('lambda-calculus');
    await topicPage.waitForFunction(() => document.querySelector('[role="radiogroup"][aria-label="Graph view"] [aria-checked="true"]')?.textContent.startsWith('Practical'));
    if ((await picker.inputValue()) !== 'lambda-calculus') throw new Error('The picked topic should stay selected after widening');
    // Narrowing the view so the topic disappears drops it; Reset clears it too
    await topicPage.getByRole('radio', { name: /Essentials/ }).click();
    await topicPage.waitForFunction(() => document.querySelector('[data-testid="topic-picker"]').value === '');
    await picker.selectOption('types-data');
    await topicPage.getByRole('button', { name: /Reset/ }).click();
    if ((await picker.inputValue()) !== '') throw new Error('Reset should go back to all topics');
    await topicPage.close();
    console.log('✓ Test 10 passed: Topics frame their ring, widen the view when hidden, and reset cleanly.');

  } catch (err) {
    console.error('Test failed:', err);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(exitCode);
  }
});
