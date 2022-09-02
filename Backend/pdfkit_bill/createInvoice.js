const fs = require("fs");
const PDFDocument = require("pdfkit");

const createInvoice = (invoice) => {
  let doc = new PDFDocument({ margin: 50 });
  let path;
  
  if(invoice.cabin){
    path = './invoices';
  }
  if(invoice.service){
    path = './service_invoice'
  }
 
  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateFooter(doc);
  doc.end();
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  doc.pipe(fs.createWriteStream(`${path}/invoice${invoice.bill_id}.pdf`));
}

function generateHeader(doc) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Village People Oy", 50, 57)
    .fontSize(10)
    .text("Rukapolku 15", 200, 65, { align: "right" })
    .text("Ruka, 93825", 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 14 days. Thank you for your reservation.",
      50,
      720,
      { align: "center", width: 500 }
    );
}


const generateCustomerInformation = (doc, invoice) => {
  let d = new Date();

  if (invoice.cabin) {
    doc
      .text(`Invoice Number: ${invoice.bill_id}`, 50, 200)
      .text(`Invoice Date: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, 50, 215)
      .text(`${invoice.firstname}  ${invoice.lastname}`, 400, 200)
      .text(invoice.address, 400, 215)
      .text(`${invoice.postcode}, ${invoice.postarea}`, 400, 230)
      .moveTo(50, 250)
      .lineTo(500, 250)
      .fontSize(15)
      .text('Cabin Reservation Invoice', 50, 350, { underline: true })
      .fontSize(10)
      .text('Cabin', 50, 450, { underline: true })
      .text('Arrival date', 150, 450, { underline: true })
      .text('Departure date', 250, 450, { underline: true })
      .text('Total sum', 350, 450, { align: "right", underline: true })
      .fontSize(10)
      .text(invoice.cabin, 50, 470)
      .text(invoice.arrivaldate, 150, 470)
      .text(invoice.leavedate, 250, 470)
      .text(`${invoice.price}€`, 350, 470, { align: "right" })
      .text('Bank account: Village People Oy', 400, 600, { align: "right" })
      .text('IBAN: XXXXXXXXXXXX', 400, 615, { align: "right" })
      .text(`Reference: Cabin ${invoice.bill_id}`, 400, 630, { align: "right" })
      .text(`Total sum: ${invoice.price}€`, 400, 645, { align: "right" })
      .text(`Due date ${invoice.duedate}`, 400, 660, { align: "right" })
  }
  else{
    doc
    .text(`Invoice Number: ${invoice.bill_id}`, 50, 200)
    .text(`Invoice Date: ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`, 50, 215)
    .text(`${invoice.firstname}  ${invoice.lastname}`, 400, 200)
    .text(invoice.address, 400, 215)
    .text(`${invoice.postcode}, ${invoice.postarea}`, 400, 230)
    .moveTo(50, 250)
    .lineTo(500, 250)
    .fontSize(15)
    .text('Service Reservation Invoice', 50, 350, { underline: true })
    .fontSize(10)
    .text('Service', 50, 450, { underline: true })
    .text('Reservation date', 150, 450, { underline: true })
    .text('Total sum', 350, 450, { align: "right", underline: true })
    .fontSize(10)
    .text(invoice.cabin, 50, 470)
    .text(`${invoice.reservationdate.getDate()}/${invoice.reservationdate.getMonth()+1}/${invoice.reservationdate.getFullYear()}`, 150, 470)
    .text(`${invoice.price}€`, 350, 470, { align: "right" })
    .text('Bank account: Village People Oy', 400, 600, { align: "right" })
    .text('IBAN: XXXXXXXXXXXX', 400, 615, { align: "right" })
    .text(`Reference: Service ${invoice.bill_id}`, 400, 630, { align: "right" })
    .text(`Total sum: ${invoice.price}€`, 400, 645, { align: "right" })
    .text(`Due date ${invoice.duedate}`, 400, 660, { align: "right" })
  }

}

module.exports = {

  createInvoice: (invoice) => {
    return createInvoice(invoice);
  }
}

