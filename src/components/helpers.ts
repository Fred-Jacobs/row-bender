
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function catchMessage(e: any) : string {
    if (typeof e === 'string') {
      return e
    } else if (e instanceof Error) {
      return e.message
    }
    return 'unknow error'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function parseCsv(csvRaw: string, csvHasHeader: boolean) : any {
    const lines = csvRaw.split(/\r?\n/);
    const headers: string[] = []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowsData : any[] = []
    const firstLineParts = lines[0].split(';')
    for (let index = 0; index < firstLineParts.length; index++) {
      if (csvHasHeader) {
        headers.push(firstLineParts[index])
      }
      else {
        headers.push(`c${index}`)
      }
    }
    let index = csvHasHeader ? 1 : 0
    for (index; index < lines.length; index++) {
      const lineRaw = lines[index]
      if (lineRaw.trim() == '') continue
      const lineParts = lineRaw.split(';')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const line : any = {}
      const l0 = csvHasHeader ? index-1 : index
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      line['l0'] = l0.toString()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      line['l1'] = (l0+1).toString()

      for (let i = 0; i < headers.length; i++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        line[headers[i]] = lineParts[i]
      }
      rowsData.push(line)
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return rowsData
  }

  export {
    catchMessage,
    parseCsv
  }
