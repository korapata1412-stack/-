/**
 * สคริปต์สำหรับดึงรายชื่อไฟล์จาก Google Drive ลง Google Sheets
 * วิธีใช้:
 * 1. เปิด Google Sheet ใหม่
 * 2. ไปที่ Extensions (ส่วนขยาย) > Apps Script
 * 3. ลบโค้ดเดิมออกให้หมด แล้ววางโค้ดนี้ลงไป
 * 4. กด Save (รูปแผ่นดิสก์)
 * 5. กด Run (ปุ่ม Play)
 * 6. ให้สิทธิ์การเข้าถึง (Review Permissions -> Choose Account -> Advanced -> Go to ... (unsafe) -> Allow)
 */

function listFilesToSheet() {
  // ID ของโฟลเดอร์ที่คุณส่งมา (เกียรติบัตรกีฬาสี PDWK)
  var folderId = '1XVTh6KLeF2Eq7tQjoHwDJvyv2svTJ09m'; 
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear(); // ล้างข้อมูลเก่า
  
  // สร้างหัวตาราง
  sheet.appendRow(['name', 'surname', 'class', 'certificate_url', 'filename']);
  
  try {
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFiles();
    
    while (files.hasNext()) {
      var file = files.next();
      var fileName = file.getName();
      var fileUrl = file.getUrl();
      
      // พยายามแยกชื่อ นามสกุล จากชื่อไฟล์ (สมมติชื่อไฟล์คือ "สมชาย ใจดี.jpg")
      // คุณอาจต้องมาแก้ข้อมูลใน Sheet อีกครั้งหากชื่อไฟล์ไม่สมบูรณ์
      var nameParts = fileName.split('.')[0].split(' ');
      var firstName = nameParts[0] || '';
      var lastName = nameParts[1] || '';
      var studentClass = ''; // ต้องมากรอกเอง หรือตั้งชื่อไฟล์ให้มีชั้น เช่น "สมชาย ใจดี ม.1.jpg"
      
      // เปลี่ยน Link ให้เป็นแบบ Preview เพื่อให้เปิดง่ายขึ้น (Optional)
      var viewUrl = fileUrl.replace('/view?usp=drivesdk', '/preview').replace('/view?usp=sharing', '/preview');

      sheet.appendRow([firstName, lastName, studentClass, viewUrl, fileName]);
    }
    
    Logger.log('เสร็จสิ้น! ดึงข้อมูลเรียบร้อยแล้ว');
    Browser.msgBox('ดึงข้อมูลเสร็จเรียบร้อย! กรุณาตรวจสอบและเติมข้อมูล "ชั้น" ให้ครบถ้วน');
    
  } catch (e) {
    Logger.log('Error: ' + e.toString());
    Browser.msgBox('เกิดข้อผิดพลาด: ' + e.toString());
  }
}
