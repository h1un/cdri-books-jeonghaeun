/** 커밋 형식: <type>: <제목> (#이슈번호) — scope는 쓰지 않는다. */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'perf', 'style', 'design', 'test', 'docs', 'chore'],
    ],
    'scope-empty': [2, 'always'],
    // 한국어 제목을 쓰므로 대소문자 규칙은 끈다.
    'subject-case': [0],
    'header-max-length': [2, 'always', 72],
    // 모든 커밋은 이슈 번호(#N)를 참조한다.
    'references-empty': [2, 'never'],
  },
};
