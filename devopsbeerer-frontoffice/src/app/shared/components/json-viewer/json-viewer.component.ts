import { Component, input, InputSignal, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-json-viewer',
  imports: [],
  templateUrl: './json-viewer.component.html',
  styleUrl: './json-viewer.component.scss'
})
export class JsonViewerComponent implements OnChanges {
  jsonData: InputSignal<string | object> = input.required<string | object>();
  formattedJson: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jsonData']) {
      this.formatJson();
    }
  }

  private formatJson(): void {
    try {
      // Convert string to object if needed
      const jsonObject = typeof this.jsonData() === 'string'
        ? JSON.parse(this.jsonData() as string)
        : this.jsonData;

      // Format with 2 spaces indentation
      const formatted = JSON.stringify(jsonObject, null, 2);

      // Apply syntax highlighting
      this.formattedJson = formatted;
    } catch (e) {
      this.formattedJson = `Error parsing JSON: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  private highlightSyntax(json: string): string {
    // Replace with highlighting
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        // Determine the type of the value
        let cls = 'number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'key';
            // Remove the colon at the end
            match = match.slice(0, -1) + '</span>:';
          } else {
            cls = 'string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return `<span class="${cls}">${match}</span>`;
      });
  }


}
