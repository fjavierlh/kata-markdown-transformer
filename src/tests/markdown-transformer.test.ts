import { MarkdownTransformer } from '../core/markdown-transformer';

describe('The Markdown Transformer', () => {
  it('given markdown without URLs return same markdown', () => {
    const inputMarkdown = 'this markdown does not have URLs.';
    const markdownTransformer = new MarkdownTransformer();

    expect(markdownTransformer.transform(inputMarkdown)).toBe(inputMarkdown);
  });

  it('transform a single url markdown to anchor', () => {
    const inputMarkdown = '[this book](https://codigosostenible.com) and some other text.';
    const expectedOutput = `this book[^anchor1] and some other text.\n[^anchor1]:https://codigosostenible.com`;

    const markdownTransformer = new MarkdownTransformer();
    expect(markdownTransformer.transform(inputMarkdown)).toBe(expectedOutput);
  });

  it('transform multiple url markdown to anchor', () => {
    const inputMarkdown =
      '[this book](https://codigosostenible.com) and some [other book](https://testingsostenible.com).';
    const expectedOutput = `this book[^anchor1] and some other book[^anchor2].\n[^anchor1]:https://codigosostenible.com\n[^anchor2]:https://testingsostenible.com`;

    const markdownTransformer = new MarkdownTransformer();

    expect(markdownTransformer.transform(inputMarkdown)).toBe(expectedOutput);
  });

  it('transform multiple url markdown with same url to anchor', () => {
    const inputMarkdown =
      '[this book](https://codigosostenible.com) and [the same book](https://codigosostenible.com).';
    const expectedOutput = 'this book[^anchor1] and the same book[^anchor1].\n[^anchor1]:https://codigosostenible.com';

    const markdownTransformer = new MarkdownTransformer();

    expect(markdownTransformer.transform(inputMarkdown)).toBe(expectedOutput);
  });

  it('transform multiple url markdown with repeated urls to anchor', () => {
    const inputMarkdown =
      '[this book](https://codigosostenible.com) and [the same book](https://codigosostenible.com). But this is [another book](http://refactoring.guru)';
    const expectedOutput =
      'this book[^anchor1] and the same book[^anchor1]. But this is another book[^anchor2]\n[^anchor1]:https://codigosostenible.com\n[^anchor2]:http://refactoring.guru';

    const markdownTransformer = new MarkdownTransformer();

    expect(markdownTransformer.transform(inputMarkdown)).toBe(expectedOutput);
  });

  it('transform multiple url markdown with repeated urls to anchor', () => {
    const inputMarkdown =
      '[this book](https://codigosostenible.com)[and the same book](https://codigosostenible.com). But this is [another book](http://refactoring.guru)';
    const expectedOutput =
      'this book[^anchor1]and the same book[^anchor1]. But this is another book[^anchor2]\n[^anchor1]:https://codigosostenible.com\n[^anchor2]:http://refactoring.guru';

    const markdownTransformer = new MarkdownTransformer();

    expect(markdownTransformer.transform(inputMarkdown)).toBe(expectedOutput);
  });
});
