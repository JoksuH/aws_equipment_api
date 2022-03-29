const fetchData = async (event) => {
  event.preventDefault()
  const limit = document.getElementById('limit').value
  const id = document.getElementById('idNumber').value
  let data = await getData(limit, id)

  let table = document.querySelector('table') || document.querySelector('#main').appendChild(document.createElement('table'))
  while (table.lastChild) {
    table.removeChild(table.lastChild)
  }
  let firstRow = table.appendChild(document.createElement('tr'))

  // Setting field names manually to ensure their correct order
  const fieldNamesArr = ['number', 'address', 'contractStartDate', 'contractEndDate', 'status']
  fieldNamesArr.forEach((key) => {
    let header = firstRow.appendChild(document.createElement('th'))
    header.innerText = key.charAt(0).toUpperCase() + key.slice(1)
  })
  addDatatoTable(data, table, fieldNamesArr)
}

const getData = async (limit, id) => {
  let response
  if (id) response = await fetch(`https://f1hf1f9te2.execute-api.us-east-1.amazonaws.com/equipment/${id}`)
  else if (limit) response = await fetch(`https://f1hf1f9te2.execute-api.us-east-1.amazonaws.com/equipment?limit=${limit}`)
  else response = await fetch(`https://f1hf1f9te2.execute-api.us-east-1.amazonaws.com/equipment`)
  return await response.json()
}

const addDatatoTable = (data, table, fieldNamesArr) => {
  data.forEach((equipment, index) => {
    const tableRow = table.appendChild(document.createElement('tr'))
    if (index % 2 === 0) tableRow.className = 'even'
    for (let i = 0; i < fieldNamesArr.length; i++) {
      const key = fieldNamesArr[i]
      const dataColumn = tableRow.appendChild(document.createElement('td'))
      formatfieldText(equipment, key, dataColumn)
    }
  })
}

const formatfieldText = (equipment, key, dataColumn) => {
  if (equipment[key] === undefined) dataColumn.innerText = ''
  else if (key === 'address') dataColumn.innerText = equipment[key].street + ' , ' + equipment[key].city
  else if (key === 'contractStartDate' || key === 'contractEndDate') dataColumn.innerText = equipment[key].split('T')[0]
  else if (key === 'status') dataColumn.innerText = equipment[key] ? 'Running' : 'Stopped'
  else dataColumn.innerText = equipment[key]
}
