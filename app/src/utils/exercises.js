// Exercise checking, shared by the editor and tests/runner.test.mjs.

// Line endings and trailing whitespace (per line and at the end) don't count
export const normaliseOutput = (text) =>
  (text ?? '').replace(/\r\n?/g, '\n').split('\n').map((line) => line.trimEnd()).join('\n').trimEnd();

// Diagnostics from the exercise analyzer (analyzers/): FPJ rules, and AD0001
// when the analyzer itself failed
export const isRuleDiagnostic = (d) => d.id.startsWith('FPJ') || d.id === 'AD0001';

export const brokenRules = (diagnostics) =>
  (diagnostics ?? []).filter((d) => isRuleDiagnostic(d) && d.severity === 'error');

// A run passes when it compiled, didn't throw or time out, broke none of the
// exercise's rules and printed the expected output
export function checkRun(result, expected) {
  if (!result || result.timedOut) return { passed: false, reason: 'timeout' };
  if (!result.compiled) return { passed: false, reason: 'compile' };
  if (result.exception) return { passed: false, reason: 'exception' };
  if (brokenRules(result.diagnostics).length) return { passed: false, reason: 'rules' };
  const passed = normaliseOutput(result.output) === normaliseOutput(expected);
  return { passed, reason: passed ? null : 'output' };
}

// Which diagnostics each rule kind reports (see Descriptors.cs)
const RULE_IDS = {
  avoid: (id) => id === 'FPJ001',
  require: (id) => id === 'FPJ002',
  pure: (id) => id === 'FPJ003',
  check: (id) => /^FPJ1\d\d$/.test(id),
};

const memberNames = (targets) => targets.split(',').map((t) => '`' + t.trim().split('.').pop() + '`');
const list = (items, word) => items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} ${word} ${items.at(-1)}`;

// A rule line as a checklist item: "Don't use `Match` or `IfNone` in ShoutName"
export function describeRule(rule) {
  const [spec, message = ''] = rule.split('|').map((part) => part.trim());
  const [, kind, rest = ''] = /^(\w+)\s*(.*)$/.exec(spec) ?? [];
  const [targets, scope] = rest.split(/ in (?=\S+$)/);
  const where = scope ? ` in ${scope}` : '';
  switch (kind) {
    case 'avoid': return `Don’t use ${list(memberNames(targets), 'or')}${where}`;
    case 'require': return `Use ${list(memberNames(targets), 'or')}${where}`;
    case 'pure': return `Keep ${list(targets.split(',').map((t) => t.trim()), 'and')} pure`;
    default: return message || spec;
  }
}

// Each rule's state for the checklist: 'kept', 'broken', or 'unchecked' before
// the first check (diagnostics null) or while the code doesn't compile (rules
// are only checked once it does). Rules of the same kind share their
// diagnostics, so two broken `avoid` rules both show broken.
export function ruleStates(rules, diagnostics) {
  const all = diagnostics ?? [];
  // A rule that couldn't be read, or an analyzer failure, leaves every rule unknown
  const failed = all.some((d) => ['FPJ000', 'FPJ999', 'AD0001'].includes(d.id));
  const compiles = diagnostics != null && !failed && !all.some((d) => d.severity === 'error' && !isRuleDiagnostic(d));
  return (rules ?? []).map((rule) => {
    const kind = rule.split(/\s/, 1)[0];
    const broken = all.some((d) => d.severity === 'error' && RULE_IDS[kind]?.(d.id));
    return { rule, label: describeRule(rule), state: !compiles ? 'unchecked' : broken ? 'broken' : 'kept' };
  });
}
