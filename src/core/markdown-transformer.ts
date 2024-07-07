export class MarkdownTransformer {
  private linkTextRegex = '[^\\[\\]]+';
  private URLRegex = '(https|http):\\/\\/[^\\(\\)]+';

  public transform(markdown: string): string {
    const matchedURLsInMarkdown = this.matchURLsIn(markdown);

    if (matchedURLsInMarkdown == null) {
      return markdown;
    }

    const dictionary = this.createURLsDictionaryFrom(matchedURLsInMarkdown);
    const transformedMarkdown = this.linkURLsToAnchors(dictionary, markdown);
    const footnotes = this.footnotesFrom(dictionary);
    return this.appendTo(transformedMarkdown, footnotes);
  }

  private matchURLsIn(markdown: string) {
    const urlMarkdownRegex = new RegExp(`\\[${this.linkTextRegex}\\]\\(${this.URLRegex}\\)`, 'g');
    const matchedMarkdownURLs = markdown.match(urlMarkdownRegex);
    return matchedMarkdownURLs;
  }

  private createURLsDictionaryFrom(matchedMarkdownURLs: RegExpMatchArray) {
    return matchedMarkdownURLs.reduce((dictionary, markdownURL) => {
      const url = markdownURL.match(this.URLRegex)?.[0];
      const linkedText = markdownURL.match(this.linkTextRegex)?.[0];

      if (!url || !linkedText) {
        return dictionary;
      }

      const previousValues = dictionary.get(url) || [];
      dictionary.set(url, [...previousValues, [markdownURL, linkedText]]);
      return dictionary;
    }, new Map<string, string[][]>());
  }

  private linkURLsToAnchors = (dictionary: Map<string, string[][]>, markdown: string) => {
    return Array.from(dictionary).reduce((text, [, values]: [string, string[][]], index: number) => {
      const anchor = this.getAnchorMarkdownFor(index);
      return this.replaceURLbyAnchor(values, text, anchor);
    }, markdown);
  };

  private footnotesFrom(dictionary: Map<string, string[][]>) {
    return Array.from(dictionary).reduce((footnotes, [url], index) => {
      const anchor = this.getAnchorMarkdownFor(index);
      const anchorWithURL = `${anchor}:${url}`;
      footnotes.push(anchorWithURL);
      return footnotes;
    }, [] as string[]);
  }

  private getAnchorMarkdownFor(index: number) {
    return `[^anchor${index + 1}]`;
  }

  private replaceURLbyAnchor(values: string[][], text: string, anchor: string) {
    return values.reduce((transformedText, [original, replacement]) => {
      return transformedText.replace(original, replacement + anchor);
    }, text);
  }

  private appendTo(markdown: string, anchors: string[]): string {
    return markdown.concat(...anchors.map((anchor) => '\n' + anchor));
  }
}
