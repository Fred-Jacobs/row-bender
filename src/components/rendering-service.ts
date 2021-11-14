import mustache from 'mustache'

class RowsData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public rows: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
}

export class RenderingResult {
  public value: string
  public error: string
  constructor(value: string, error: string) {
    this.value = value
    this.error = error
  }
}

export class RenderingService {
  private csvRaw = ''
  private csvHasHeader = true
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private rowsData: RowsData = new RowsData()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {

  }

  private parseCsv() {
    const lines = this.csvRaw.split(/\r?\n/);
    const headers: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowsData : any[] = []
    const firstLineParts = lines[0].split(';')
    for (let index = 0; index < firstLineParts.length; index++) {
      if (this.csvHasHeader) {
        headers.push(firstLineParts[index])
      }
      else {
        headers.push(`c${index}`)
      }
    }
    let index = this.csvHasHeader ? 1 : 0
    for (index; index < lines.length; index++) {
      const lineRaw = lines[index]
      if (lineRaw.trim() == '') continue
      const lineParts = lineRaw.split(';')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const line : any = {}

      for (let i = 0; i < headers.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        line[headers[i]] = lineParts[i]
      }
      rowsData.push(line)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rowsData
  }

  public generate(template: string, rawData: string, hasHeaders: boolean) : RenderingResult {
    if (this.csvRaw !== rawData || hasHeaders != this.csvHasHeader || this.rowsData.rows.length == 0) {
      this.csvHasHeader = hasHeaders
      this.csvRaw = rawData
      this.rowsData.rows = this.parseCsv()
    }

    // if (typeof template !== 'string'){
    //   debugger
    //   // return ''
    // }

    try {
      const result = mustache.render(template, this.rowsData)
      return new RenderingResult(result, '')
    } catch (e) {
      let errorMessage = ''
      if (typeof e === 'string') {
        errorMessage = e
      } else if (e instanceof Error) {
        errorMessage = e.message
      }
      else {
        errorMessage = 'unknow error'
        // debugger
      }
      return new RenderingResult('', errorMessage)
    }
  }
}
