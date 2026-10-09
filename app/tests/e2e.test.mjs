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
  '.ico': 'image/x-icon'
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
    const tabTitle = await page.title();
    if (!/^Thunk · .+ — FP Jargon$/.test(tabTitle)) throw new Error(`Tab title should name the term and topic, got: ${tabTitle}`);
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
    if (!(await page.title()).startsWith('FP Jargon —')) throw new Error('Clearing the selection should restore the tab title');
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
    const checkedView = () => viewPage.locator('[role="radiogroup"][aria-label="Graph view"] [aria-checked="true"]').textContent();
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

    console.log('Running test 10: Topic picker frames a topic and widens the view when needed...');
    const topicPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await topicPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await topicPage.evaluate(() => localStorage.removeItem('fp_view'));
    await topicPage.reload({ waitUntil: 'networkidle' });
    const topicView = () => topicPage.locator('[role="radiogroup"][aria-label="Graph view"] [aria-checked="true"]').textContent();
    if (!(await topicView()).startsWith('Essentials')) throw new Error('Should start in Essentials');
    const picker = topicPage.getByRole('radiogroup', { name: 'Topic' });
    const topicItem = (name) => picker.getByRole('radio', { name });
    const pickedTopic = () => picker.locator('[aria-checked="true"]').textContent();
    if ((await picker.getByRole('radio').count()) !== 9) throw new Error('The picker should list all 8 topics plus "All topics"');
    if (!(await topicItem(/Lambda Calculus/).textContent()).includes('in Practical')) throw new Error('A topic Essentials hides should say which view shows it');
    // A topic the view shows keeps the view
    await topicItem(/Effects/).click();
    if (!(await topicView()).startsWith('Essentials')) throw new Error('Effects is in Essentials; the view should stay');
    await topicPage.waitForFunction(() => document.title === 'Effects — FP Jargon', null, { timeout: 3000 });
    // A topic it hides widens to the next view that has it
    await topicItem(/Lambda Calculus/).click();
    await topicPage.waitForFunction(() => document.querySelector('[role="radiogroup"][aria-label="Graph view"] [aria-checked="true"]')?.textContent.startsWith('Practical'));
    if (!(await pickedTopic()).includes('Lambda Calculus')) throw new Error('The picked topic should stay selected after widening');
    // Zooming far out lets go of the topic
    await topicPage.mouse.move(640, 400);
    for (let i = 0; i < 12; i++) await topicPage.mouse.wheel(0, 200);
    if (!(await pickedTopic()).startsWith('All topics')) throw new Error('Zooming out should go back to all topics');
    // Narrowing the view so the topic disappears drops it; Reset clears it too
    await topicItem(/Lambda Calculus/).click();
    await topicPage.getByRole('radio', { name: /Essentials/ }).click();
    await topicPage.waitForFunction(() => document.querySelector('[data-testid="topic-picker"] [aria-checked="true"]')?.textContent.startsWith('All topics'));
    await topicItem(/Types/).first().click();
    await topicPage.getByRole('button', { name: /Reset/ }).click();
    if (!(await pickedTopic()).startsWith('All topics')) throw new Error('Reset should go back to all topics');
    await topicPage.waitForFunction(() => document.title.startsWith('FP Jargon —'), null, { timeout: 3000 });
    await topicPage.close();
    console.log('✓ Test 10 passed: Topics frame their ring, widen the view when hidden, follow the camera out, and reset cleanly.');

    console.log('Running test 11: View and topic deep links...');
    const linkPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await linkPage.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
    await linkPage.evaluate(() => localStorage.setItem('fp_view', 'essentials'));
    const linkView = () => linkPage.locator('[role="radiogroup"][aria-label="Graph view"] [aria-checked="true"]').textContent();
    const linkTopic = () => linkPage.locator('[data-testid="topic-picker"] [aria-checked="true"]').textContent();
    const query = () => new URL(linkPage.url()).searchParams;
    // ?view= wins over the remembered view, and ?topic= frames that topic
    await linkPage.goto(`http://localhost:${PORT}/?view=everything&topic=effects`, { waitUntil: 'networkidle' });
    if (!(await linkView()).startsWith('Everything')) throw new Error('?view= should win over the remembered view');
    if (!(await linkTopic()).startsWith('Effects')) throw new Error('?topic= should pick that topic');
    await linkPage.waitForFunction(() => document.title === 'Effects — FP Jargon', null, { timeout: 3000 });
    // A topic the linked view hides widens it
    await linkPage.goto(`http://localhost:${PORT}/?view=essentials&topic=lambda-calculus`, { waitUntil: 'networkidle' });
    if (!(await linkView()).startsWith('Practical')) throw new Error('A topic Essentials hides should widen the view to Practical');
    if (!(await linkTopic()).startsWith('Lambda Calculus')) throw new Error('The linked topic should stay picked after widening');
    // Picking a topic and view writes them back to the URL
    await linkPage.getByRole('radiogroup', { name: 'Topic' }).getByRole('radio', { name: /Types/ }).click();
    await linkPage.getByRole('radio', { name: /Everything/ }).click();
    if (query().get('topic') !== 'types-data' || query().get('view') !== 'everything') throw new Error(`URL should carry the view and topic, got ${linkPage.url()}`);
    // Selecting and closing a term swaps only the hash
    await linkPage.goto(`http://localhost:${PORT}/?view=everything&topic=effects#thunk`, { waitUntil: 'networkidle' });
    if (!(await linkPage.locator('aside').isVisible())) throw new Error('#thunk should open alongside the query');
    await linkPage.keyboard.press('Escape');
    await linkPage.waitForTimeout(300);
    if (linkPage.url().includes('#') || query().get('topic') !== 'effects') throw new Error(`Closing the term should keep the query, got ${linkPage.url()}`);
    await linkPage.close();
    console.log('✓ Test 11 passed: ?view= and ?topic= open where they point and follow the picker.');

  } catch (err) {
    console.error('Test failed:', err);
    exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    process.exit(exitCode);
  }
});
