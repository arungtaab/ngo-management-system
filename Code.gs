// ==================== NGO Management System ====================

// use PropertiesService to save data permanently
const PROPERTY_STORE = PropertiesService.getScriptProperties();

// initialize data
function initializeData() {
  const defaultData = {
    volunteers: [
      {ID: 'V001', name: '張小明', phone: '91234567', email: 'ming@email.com', skills: '攝影,翻譯', status: '活躍', joinDate: '2024-01-15', notes: '攝影技術優良，擅長活動攝影'},
      {ID: 'V002', name: '李美華', phone: '98765432', email: 'mei@email.com', skills: '文書處理,活動策劃', status: '活躍', joinDate: '2024-02-20', notes: '活動策劃經驗豐富，溝通能力強'}
    ],
    donations: [
      {ID: 'D001', donor: '張小明', amount: 5000, currency: 'HKD', date: '2024-03-01', purpose: '教育項目'},
      {ID: 'D002', donor: '李美華', amount: 3000, currency: 'HKD', date: '2024-03-05', purpose: '醫療援助'}
    ],
    todos: [
      {ID: 'T001', title: '準備季度報告', description: '整理第一季度的活動報告', assignee: '張小明', dueDate: '2024-03-31', status: '待處理', priority: '高'},
      {ID: 'T002', title: '採購活動物資', description: '購買下月活動所需物資', assignee: '李美華', dueDate: '2024-04-05', status: '進行中', priority: '中'}
    ],
    members: [
      {ID: 'M001', name: '王建國', phone: '98887766', email: 'wang@email.com', interests: '環保,教育', joinDate: '2023-09-10', notes: '環保活動積極參與者，經常捐款支持'},
      {ID: 'M002', name: '林美珍', phone: '95556677', email: 'lin@email.com', interests: '兒童福利', joinDate: '2024-02-18', notes: '兒童心理學專業，志願參與輔導工作'}
    ],
    programs: [
      {ID: 'P001', name: '社區清潔日', startDate: '2024-03-20', endDate: '2024-03-20', status: '已完成', budget: 5000, manager: '張小明', progress: 100, description: '社區環境清潔活動'},
      {ID: 'P002', name: '長者探訪計劃', startDate: '2024-02-01', endDate: '2024-06-30', status: '進行中', budget: 15000, manager: '李美華', progress: 65, description: '定期探訪社區長者'},
      {ID: 'P003', name: '兒童學習營', startDate: '2024-04-15', endDate: '2024-04-20', status: '計劃中', budget: 20000, manager: '陳大文', progress: 30, description: '暑期兒童學習活動'}
    ]
  };
  
  const storedData = PROPERTY_STORE.getProperty('ngo_data');
  if (!storedData) {
    PROPERTY_STORE.setProperty('ngo_data', JSON.stringify(defaultData));
    return defaultData;
  }
  
  return JSON.parse(storedData);
}

// get stored data
function getStoredData() {
  try {
    const storedData = PROPERTY_STORE.getProperty('ngo_data');
    if (!storedData) {
      return initializeData();
    }
    return JSON.parse(storedData);
  } catch (e) {
    console.error('Error getting stored data:', e);
    return initializeData();
  }
}

// save data
function saveData(data) {
  try {
    PROPERTY_STORE.setProperty('ngo_data', JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error saving data:', e);
    return false;
  }
}

// ==================== main ====================
function doGet() {
  try {
    initializeData();
    
    return HtmlService.createHtmlOutputFromFile('index')
      .setTitle('NGO Management System')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (error) {
    console.error('doGet error:', error);
    return HtmlService.createHtmlOutput('<h1>Error loading application</h1><p>' + error.message + '</p>');
  }
}

// ==================== function to retrieve data ====================
function getData(type) {
  try {
    const data = getStoredData();
    console.log('Getting data for type:', type, 'found:', data[type] ? data[type].length : 0);
    
    return {
      success: true,
      data: data[type] || [],
      count: (data[type] || []).length,
      type: type
    };
  } catch (error) {
    console.error('getData error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// get record by id
function getRecord(type, id) {
  try {
    const data = getStoredData();
    const records = data[type] || [];
    const record = records.find(item => item.ID === id);
    
    if (!record) {
      return {
        success: false,
        message: 'Record not found 記錄不存在'
      };
    }
    
    return {
      success: true,
      data: record,
      type: type
    };
  } catch (error) {
    console.error('getRecord error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// get statistics of dashboard
function getDashboardStats() {
  try {
    console.log('Getting dashboard stats...');
    const data = getStoredData();
    
    const volunteers = data.volunteers || [];
    const donations = data.donations || [];
    const todos = data.todos || [];
    const members = data.members || [];
    const programs = data.programs || [];
    
    // analyze amount
    const stats = {
      volunteers: {
        total: volunteers.length,
        active: volunteers.filter(v => v.status === '活躍').length
      },
      members: {
        total: members.length,
        newThisMonth: members.filter(m => {
          try {
            const joinDate = new Date(m.joinDate);
            const now = new Date();
            return joinDate.getMonth() === now.getMonth() && 
                   joinDate.getFullYear() === now.getFullYear();
          } catch (e) {
            return false;
          }
        }).length
      },
      donations: {
        total: donations.length,
        amount: donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
        average: donations.length > 0 ? Math.round(donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0) / donations.length) : 0
      },
      todos: {
        total: todos.length,
        pending: todos.filter(t => t.status === '待處理').length,
        highPriority: todos.filter(t => t.priority === '高').length
      },
      programs: {
        total: programs.length,
        active: programs.filter(p => p.status === '進行中').length,
        completed: programs.filter(p => p.status === '已完成').length,
        totalBudget: programs.reduce((sum, p) => sum + (Number(p.budget) || 0), 0)
      }
    };
    
    // latest 3 data
    const latest = {
      volunteers: volunteers.slice(-3).reverse(),
      donations: donations.slice(-3).reverse(),
      todos: todos.slice(-3).reverse(),
      members: members.slice(-3).reverse(),
      programs: programs.slice(-3).reverse()
    };
    
    return {
      success: true,
      stats: stats,
      latest: latest,
      lastUpdated: new Date().toLocaleString(),
      dataSummary: {
        totalRecords: volunteers.length + members.length + donations.length + todos.length + programs.length,
        hasData: volunteers.length > 0 || members.length > 0 || donations.length > 0 || todos.length > 0 || programs.length > 0
      }
    };
    
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return {
      success: false,
      message: 'Failed to load dashboard stats: ' + error.message
    };
  }
}

// add new data
function addData(type, formData) {
  try {
    const data = getStoredData();
    
    if (!data[type]) {
      data[type] = [];
    }
    
    const id = generateID(type, data[type]);
    const newRecord = { ID: id, ...formData };
    
    // ensure notes exist
    if (!newRecord.notes) {
      newRecord.notes = '';
    }
    
    console.log('Adding new record:', newRecord);
    
    data[type].push(newRecord);
    
    if (saveData(data)) {
      return {
        success: true,
        message: '添加成功 Added successfully',
        data: newRecord,
        id: id
      };
    } else {
      return {
        success: false,
        message: '保存失敗 Failed to save'
      };
    }
  } catch (error) {
    console.error('addData error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// update data
function updateData(type, id, formData) {
  try {
    const data = getStoredData();
    
    if (!data[type]) {
      return { success: false, message: '數據類型不存在 Data type not found' };
    }
    
    const index = data[type].findIndex(item => item.ID === id);
    
    if (index === -1) {
      return { success: false, message: '記錄不存在 Record not found' };
    }
    
    // keep original ID
    const updatedRecord = { ...data[type][index], ...formData, ID: id };
    
    // ensure notes exist
    if (!updatedRecord.notes) {
      updatedRecord.notes = '';
    }
    
    console.log('Updating record:', updatedRecord);
    
    data[type][index] = updatedRecord;
    
    if (saveData(data)) {
      return {
        success: true,
        message: '更新成功 Updated successfully',
        data: updatedRecord
      };
    } else {
      return {
        success: false,
        message: '保存失敗 Failed to save'
      };
    }
  } catch (error) {
    console.error('updateData error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// update notes
function updateNotes(type, id, notes) {
  try {
    const data = getStoredData();
    
    if (!data[type]) {
      return { success: false, message: '數據類型不存在 Data type not found' };
    }
    
    const index = data[type].findIndex(item => item.ID === id);
    
    if (index === -1) {
      return { success: false, message: '記錄不存在 Record not found' };
    }
    
    // only update notes
    const updatedRecord = { ...data[type][index], notes: notes || '' };
    
    console.log('Updating notes for:', id, 'notes:', notes);
    
    data[type][index] = updatedRecord;
    
    if (saveData(data)) {
      return {
        success: true,
        message: '備注更新成功 Notes updated successfully',
        data: updatedRecord
      };
    } else {
      return {
        success: false,
        message: '保存失敗 Failed to save'
      };
    }
  } catch (error) {
    console.error('updateNotes error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// delete data
function deleteData(type, id) {
  try {
    const data = getStoredData();
    
    if (!data[type]) {
      return { success: false, message: '數據類型不存在 Data type not found' };
    }
    
    const index = data[type].findIndex(item => item.ID === id);
    
    if (index === -1) {
      return { success: false, message: '記錄不存在 Record not found' };
    }
    
    const deletedItem = data[type][index];
    data[type].splice(index, 1);
    
    console.log('Deleting record:', deletedItem);
    
    if (saveData(data)) {
      return {
        success: true,
        message: '刪除成功 Deleted successfully'
      };
    } else {
      return {
        success: false,
        message: '保存失敗 Failed to save'
      };
    }
  } catch (error) {
    console.error('deleteData error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// search data
function searchData(type, query) {
  try {
    const data = getStoredData();
    const items = data[type] || [];
    
    if (!query) {
      return {
        success: true,
        data: items,
        count: items.length
      };
    }
    
    const searchTerm = query.toLowerCase();
    const filtered = items.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm)
      );
    });
    
    return {
      success: true,
      data: filtered,
      count: filtered.length,
      query: query
    };
  } catch (error) {
    console.error('searchData error:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

// import from Google Sheets
function importFromGoogleSheet(spreadsheetUrl) {
  try {
    console.log('Importing from URL:', spreadsheetUrl);
    
    let spreadsheetId = '';
    if (spreadsheetUrl.includes('/d/')) {
      spreadsheetId = spreadsheetUrl.split('/d/')[1].split('/')[0];
    } else if (spreadsheetUrl.includes('id=')) {
      spreadsheetId = spreadsheetUrl.split('id=')[1].split('&')[0];
    } else {
      spreadsheetId = spreadsheetUrl;
    }
    
    console.log('Extracted spreadsheet ID:', spreadsheetId);
    
    if (!spreadsheetId) {
      return { success: false, message: '無效的 Google Sheets URL Invalid Google Sheets URL' };
    }
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheets = spreadsheet.getSheets();
    const importedData = {};
    
    console.log('Found sheets:', sheets.length);
    
    sheets.forEach(sheet => {
      const sheetName = sheet.getName().toLowerCase();
      console.log('Processing sheet:', sheetName);
      
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      if (values.length > 1) {
        const headers = values[0];
        const rows = [];
        
        console.log('Headers:', headers);
        console.log('Rows found:', values.length - 1);
        
        for (let i = 1; i < values.length; i++) {
          const row = values[i];
          const rowObj = {};
          
          headers.forEach((header, index) => {
            if (header && header.trim()) {
              rowObj[header] = row[index] || '';
            }
          });
          
          if (Object.keys(rowObj).length > 0) {
            if (!rowObj.ID && rowObj.id) {
              rowObj.ID = rowObj.id;
              delete rowObj.id;
            }
            
            // ensure notes exist
            if (!rowObj.notes) {
              rowObj.notes = '';
            }
            
            rows.push(rowObj);
          }
        }
        
        if (rows.length > 0) {
          importedData[sheetName] = rows;
          console.log(`Imported ${rows.length} rows from ${sheetName}`);
        }
      }
    });
    
    const currentData = getStoredData();
    let totalImported = 0;
    
    Object.keys(importedData).forEach(key => {
      if (!currentData[key]) {
        currentData[key] = [];
      }
      const beforeCount = currentData[key].length;
      currentData[key] = [...currentData[key], ...importedData[key]];
      const afterCount = currentData[key].length;
      totalImported += (afterCount - beforeCount);
    });
    
    if (saveData(currentData)) {
      return {
        success: true,
        message: `從 Google Sheets 導入成功 Imported successfully from Google Sheets`,
        sheets: Object.keys(importedData),
        count: totalImported
      };
    } else {
      return {
        success: false,
        message: '保存導入數據失敗 Failed to save imported data'
      };
    }
  } catch (error) {
    console.error('importFromGoogleSheet error:', error);
    return {
      success: false,
      message: '導入失敗 Import failed: ' + error.message
    };
  }
}

// export to Google Sheets
function exportToGoogleSheet() {
  try {
    const data = getStoredData();
    const spreadsheet = SpreadsheetApp.create('NGO Data Export ' + new Date().toISOString().split('T')[0]);
    
    let sheetCount = 0;
    let totalRecords = 0;
    
    Object.keys(data).forEach(type => {
      const items = data[type];
      if (items && items.length > 0) {
        const sheet = spreadsheet.insertSheet(type);
        sheetCount++;
        totalRecords += items.length;
        
        const headers = [];
        items.forEach(item => {
          Object.keys(item).forEach(key => {
            if (!headers.includes(key)) {
              headers.push(key);
            }
          });
        });
        
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        
        const rows = items.map(item => {
          return headers.map(header => {
            const value = item[header];
            return value !== undefined && value !== null ? value : '';
          });
        });
        
        if (rows.length > 0) {
          sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
        }
        
        for (let i = 1; i <= headers.length; i++) {
          sheet.autoResizeColumn(i);
        }
      }
    });
    
    const defaultSheet = spreadsheet.getSheetByName('Sheet1');
    if (defaultSheet) {
      spreadsheet.deleteSheet(defaultSheet);
    }
    
    return {
      success: true,
      message: `導出到 Google Sheets 成功 Exported successfully to Google Sheets`,
      spreadsheetUrl: spreadsheet.getUrl(),
      spreadsheetName: spreadsheet.getName(),
      sheetCount: sheetCount,
      recordCount: totalRecords
    };
  } catch (error) {
    console.error('exportToGoogleSheet error:', error);
    return {
      success: false,
      message: '導出失敗 Export failed: ' + error.message
    };
  }
}

// generate ID
function generateID(type, dataArray) {
  const prefix = {
    volunteers: 'V',
    donations: 'D',
    todos: 'T',
    members: 'M',
    programs: 'P'
  }[type] || 'X';
  
  const maxNum = dataArray.reduce((max, item) => {
    if (item.ID && item.ID.startsWith(prefix)) {
      const num = parseInt(item.ID.substring(prefix.length)) || 0;
      return Math.max(max, num);
    }
    return max;
  }, 0);
  
  return `${prefix}${(maxNum + 1).toString().padStart(3, '0')}`;
}

// get form template
function getFormTemplate(type, id = null) {
  console.log('Getting form template for:', type, 'id:', id);
  
  const templates = {
    volunteers: [
      {name: 'name', label: '姓名 Name', type: 'text', required: true},
      {name: 'phone', label: '電話 Phone', type: 'text', required: true},
      {name: 'email', label: '電郵 Email', type: 'email', required: true},
      {name: 'skills', label: '技能 Skills', type: 'text', required: false},
      {name: 'status', label: '狀態 Status', type: 'select', options: ['活躍 Active', '休假中 On Leave', '離職 Inactive'], required: true},
      {name: 'joinDate', label: '加入日期 Join Date', type: 'date', required: true},
      {name: 'notes', label: '備註 Notes', type: 'textarea', required: false}
    ],
    donations: [
      {name: 'donor', label: '捐款者 Donor', type: 'text', required: true},
      {name: 'amount', label: '金額 Amount', type: 'number', required: true},
      {name: 'currency', label: '貨幣 Currency', type: 'select', options: ['HKD', 'USD', 'CNY'], required: true},
      {name: 'date', label: '捐款日期 Donation Date', type: 'date', required: true},
      {name: 'purpose', label: '用途 Purpose', type: 'text', required: false}
    ],
    todos: [
      {name: 'title', label: '標題 Title', type: 'text', required: true},
      {name: 'description', label: '描述 Description', type: 'textarea', required: false},
      {name: 'assignee', label: '負責人 Assignee', type: 'text', required: true},
      {name: 'dueDate', label: '截止日期 Due Date', type: 'date', required: true},
      {name: 'status', label: '狀態 Status', type: 'select', options: ['待處理 Pending', '進行中 In Progress', '已完成 Completed'], required: true},
      {name: 'priority', label: '優先級 Priority', type: 'select', options: ['高 High', '中 Medium', '低 Low'], required: true}
    ],
    members: [
      {name: 'name', label: '姓名 Name', type: 'text', required: true},
      {name: 'phone', label: '電話 Phone', type: 'text', required: true},
      {name: 'email', label: '電郵 Email', type: 'email', required: true},
      {name: 'interests', label: '興趣 Interests', type: 'text', required: false},
      {name: 'joinDate', label: '加入日期 Join Date', type: 'date', required: true},
      {name: 'notes', label: '備註 Notes', type: 'textarea', required: false}
    ],
    programs: [
      {name: 'name', label: '項目名稱 Program Name', type: 'text', required: true},
      {name: 'startDate', label: '開始日期 Start Date', type: 'date', required: true},
      {name: 'endDate', label: '結束日期 End Date', type: 'date', required: true},
      {name: 'status', label: '狀態 Status', type: 'select', options: ['計劃中 Planned', '進行中 In Progress', '已完成 Completed', '取消 Cancelled'], required: true},
      {name: 'budget', label: '預算 Budget', type: 'number', required: true},
      {name: 'manager', label: '負責人 Manager', type: 'text', required: true},
      {name: 'progress', label: '進度 Progress (%)', type: 'number', required: false, min: 0, max: 100},
      {name: 'description', label: '描述 Description', type: 'textarea', required: false}
    ]
  };
  
  const template = templates[type] || [];
  console.log('Template found:', template.length, 'fields');
  
  return {
    success: true,
    template: template,
    isEdit: id !== null
  };
}
