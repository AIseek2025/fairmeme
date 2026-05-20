import * as fs from 'fs';

  // 定义JSON文件的路径
  const filePath = './last_processed_slot.json';
// 读取JSON文件
export function readJsonFile(): number | 0 {
    

    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            if (data == ""){
                return 0;
            }else {
                return JSON.parse(data);
            }

          } else {
            fs.writeFileSync(filePath, "", 'utf-8');
            return 0;
          }
    } catch (error) {
      console.error('Error reading JSON file:', error);
      return 0;
    }
  }
  
  // 写入数据到JSON文件
  export function writeJsonFile( data: any): void {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, jsonData, 'utf8');
    } catch (error) {
      console.error('Error writing to JSON file:', error);
    }
  }
  