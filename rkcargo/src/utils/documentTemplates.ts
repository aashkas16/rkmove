// Pixel-perfect document templates matching RK Cargo Packers & Movers PDF

const LOGO_URL = window.location.origin + '/images/rk-logo.png';
const STAMP_URL = window.location.origin + '/images/stamp.png';

interface DocData {
  invoice_number: string;
  created_at: string;
  customer_name: string;
  customer_phone?: string | null;
  customer_address?: string | null;
  lr_number?: string | null;
  total_amount: number;
  subtotal: number;
  gst_percent: number;
  gst_amount: number;
  notes?: string | null;
  items: any;
  invoice_type?: string;
}

const fmtDate = (d: string) => {
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
};

const dots = (n: number) => '.'.repeat(n);

// ===================== PAGE 1: LR COPY =====================
function generateLRCopy(data: DocData): string {
  const m = data.items?.meta || {};
  const items = Array.isArray(data.items?.line_items) ? data.items.line_items : [];

  const freightSum = items.reduce((s: number, i: any) => s + (parseFloat(i.freight) || 0), 0);
  const totalAmount = data.total_amount || 0;

  const cargoRows = [...items];
  while (cargoRows.length < 8) {
    cargoRows.push({ packages: '', description: '', weight_actual: '', weight_charged: '', rate: '', freight: '' });
  }

  const formatAmtVal = (val: any) => {
    if (val === undefined || val === null || val === '') return '&nbsp;';
    const num = parseFloat(val);
    if (!isNaN(num)) {
      return '₹' + num.toLocaleString();
    }
    return String(val);
  };

  const chargesList = [
    { label: 'Freight', amount: freightSum },
    { label: 'Mazdoor Charges', amount: m.mazdoor_charges },
    { label: 'Risk Charges', amount: m.risk_charges },
    { label: 'SGST', amount: m.sgst },
    { label: 'CGST', amount: m.cgst },
    { label: 'IGST', amount: m.igst },
    { label: 'Any Other Charges', amount: m.other_charges },
  ];

  return `<!DOCTYPE html><html><head><title>LR Copy - ${data.lr_number || data.invoice_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Arial',sans-serif;color:#1a237e;padding:15px 25px;max-width:850px;margin:auto;font-size:10px;}
@page{margin:8mm;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
table{border-collapse:collapse;width:100%;}
.border-cell {
  border: 1px solid #1a237e;
  padding: 5px;
}
</style></head><body>

<!-- Top jurisdiction & GSTIN -->
<div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;font-weight:bold;">
  <span style="text-decoration:underline;">ALL SUBJECT TO AHMEDABAD JURISDICTION ONLY</span>
  <span>GSTIN : 24ARXPP9693E1ZV</span>
</div>

<!-- Header with logo -->
<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #1a237e;padding-bottom:8px;margin-bottom:8px;">
  <div style="display:flex;align-items:center;gap:10px;">
    <img src="${LOGO_URL}" style="width:70px;height:auto;" />
    <div>
      <div style="font-size:24px;font-weight:900;color:#1a237e;letter-spacing:0.5px;">R. K. <span style="color:#ea580c;">CARGO</span></div>
      <div style="font-size:10px;font-weight:bold;color:#1a237e;letter-spacing:1px;margin-top:1px;">PACKERS AND MOVERS</div>
    </div>
  </div>
  <div style="text-align:right;font-size:9px;color:#333;">
    <div>📍 Office No G-12, Lavkush Complex, Opp Green Villa, D-Cabin, Sabarmati, Ahmedabad - 380019</div>
    <div style="margin-top:2px;font-weight:bold;">M. : 09727807476, 08000141241 &nbsp; www.rkmove.com</div>
  </div>
</div>

<!-- Copy Type, Risk, Demurrage & Doc Details -->
<div style="display:flex;gap:8px;margin-bottom:8px;align-items:stretch;">
  <!-- Column 1: Caution block -->
  <div style="flex:1.2;border:1px solid #1a237e;padding:6px;font-size:8px;line-height:1.4;">
    <div style="text-align:center;font-weight:bold;font-size:9px;margin-bottom:4px;text-decoration:underline;">Caution</div>
    This consignment will not be detained, diverted, re-routed or re-booked without Consignee Bank's written permission. Will be delivered at the destination.
    <div style="border-top:1px solid #cbd5e1;margin-top:6px;padding-top:4px;font-size:7.5px;">
      Demurrage chargeable after <span style="font-weight:bold;border-bottom:1px solid #555;padding:0 4px;">${m.demurrage_days || '___'}</span> days @ Rs. <span style="font-weight:bold;border-bottom:1px solid #555;padding:0 4px;">${m.demurrage_rate || '___'}</span> per day per Qtl. on weight charged.
    </div>
  </div>
  
  <!-- Column 2: Consignee Copy & Insurance details -->
  <div style="flex:1.4;border:1px solid #1a237e;padding:6px;font-size:8.5px;line-height:1.4;">
    <div style="text-align:center;font-weight:bold;font-size:11px;color:#ef4444;">CONSIGNEE COPY</div>
    <div style="text-align:center;font-weight:bold;font-size:9px;margin-bottom:4px;">${m.insurance_risk || "AT CARRIER'S RISK"}</div>
    <div style="border-top:1px solid #cbd5e1;padding-top:4px;">
      <strong>INSURANCE:</strong> He has stated that: He has insured the consignment.<br/>
      Company: <span style="font-weight:bold;">${m.insurance_company || '_______________'}</span><br/>
      Policy No.: <span style="font-weight:bold;">${m.insurance_policy || '__________'}</span> Date: <span style="font-weight:bold;">${m.insurance_date || '______'}</span><br/>
      Amount: <span style="font-weight:bold;">${m.insurance_amount || '________'}</span> Risk: <span style="font-weight:bold;">${m.insurance_risk || '____'}</span>
    </div>
  </div>

  <!-- Column 3: Consignment Note details -->
  <div style="flex:1;border:1px solid #1a237e;padding:6px;text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;">
    <div>
      <div style="font-size:10px;font-weight:bold;color:#1a237e;">CONSIGNMENT NOTE</div>
      <div style="font-size:18px;font-weight:extrabold;color:#ef4444;margin:4px 0;">No. ${data.lr_number || data.invoice_number}</div>
      <div style="font-size:10px;font-weight:bold;">Date: ${fmtDate(data.created_at)}</div>
      <div style="font-size:9px;margin-top:6px;font-weight:bold;border-top:1px solid #cbd5e1;padding-top:4px;">Truck No: ${m.vehicle_number || '____________'}</div>
    </div>
  </div>
</div>

<!-- Routing & Customer Names details -->
<table style="width:100%;margin-bottom:8px;border-collapse:collapse;font-size:10px;">
  <tr>
    <td class="border-cell" style="width:50%;line-height:1.5;">
      <strong>Consignor's Name & Address:</strong><br/>
      <span style="font-weight:bold;font-size:10.5px;">${data.customer_name}</span><br/>
      <span>${data.customer_address || ''}</span>
    </td>
    <td class="border-cell" style="width:50%;line-height:1.5;">
      <strong>Consignee Name & Address:</strong><br/>
      <span style="font-weight:bold;font-size:10.5px;">${m.consignee_name || ''}</span><br/>
      <span>${m.consignee_address || ''}</span>
    </td>
  </tr>
  <tr>
    <td class="border-cell">
      From: <span style="font-weight:bold;">${m.from_location || ''}</span>
    </td>
    <td class="border-cell">
      To: <span style="font-weight:bold;">${m.to_location || ''}</span>
    </td>
  </tr>
</table>

<!-- Cargo & Charges Table Grid -->
<table style="border:2px solid #1a237e;width:100%;font-size:9.5px;">
  <thead>
    <tr style="background:#f0f0f8;font-weight:bold;">
      <th class="border-cell" style="width:8%;text-align:center;">Packages</th>
      <th class="border-cell" style="width:35%;text-align:center;">Description (said to contain)</th>
      <th class="border-cell" style="width:10%;text-align:center;">Wt. Actual</th>
      <th class="border-cell" style="width:10%;text-align:center;">Wt. Charged</th>
      <th class="border-cell" style="width:10%;text-align:center;">Rate</th>
      <th class="border-cell" colspan="2" style="width:27%;text-align:center;">Amount (Paid/To Pay)</th>
    </tr>
  </thead>
  <tbody>
    ${cargoRows.map((row, idx) => {
      const isChargeRow = idx < chargesList.length;
      const charge = isChargeRow ? chargesList[idx] : null;
      return `
      <tr>
        <td class="border-cell" style="text-align:center;">${row.packages || '&nbsp;'}</td>
        <td class="border-cell">${row.description || '&nbsp;'}</td>
        <td class="border-cell" style="text-align:center;">${row.weight_actual || '&nbsp;'}</td>
        <td class="border-cell" style="text-align:center;">${row.weight_charged || '&nbsp;'}</td>
        <td class="border-cell" style="text-align:center;">${row.rate || '&nbsp;'}</td>
        ${isChargeRow ? `
          <td class="border-cell" style="font-weight:bold;width:17%;">${charge?.label}</td>
          <td class="border-cell" style="text-align:right;width:10%;">${formatAmtVal(charge?.amount)}</td>
        ` : (idx === 7 ? `
          <td class="border-cell" style="font-weight:bold;background:#f0f0f8;width:17%;">Total</td>
          <td class="border-cell" style="text-align:right;font-weight:bold;background:#f0f0f8;width:10%;color:#ea580c;">₹${Number(totalAmount).toLocaleString()}</td>
        ` : `
          <td class="border-cell" style="width:17%;">&nbsp;</td>
          <td class="border-cell" style="width:10%;">&nbsp;</td>
        `)}
      </tr>
      `;
    }).join('')}
  </tbody>
</table>

<!-- Footer details -->
<div style="margin-top:6px;color:#ea580c;font-weight:bold;font-size:8.5px;text-align:center;">
  Remark: We are not liable to pay GST. GST will be paid by party direct only. Please do not pay GST amount. Pay only Freight Charges.
</div>

<table style="width:100%;margin-top:6px;font-size:9px;border-collapse:collapse;">
  <tr>
    <td style="width:55%;vertical-align:top;line-height:1.6;">
      <div style="display:flex;gap:12px;margin-bottom:6px;font-weight:bold;">
        <span>GST Payable By:</span>
        <span>[ ] Consignor</span>
        <span>[ ] Consignee</span>
      </div>
      <div>GSTIN of Person Liable to Pay: <span style="font-weight:bold;">24ARXPP9693E1ZV</span></div>
      <div style="margin-top:10px;">
        1. Subject to Ahmedabad Jurisdiction.<br/>
        2. Company is not responsible for leakage and breakage.<br/>
        3. Demurrage chargeable after free days as per rules.
      </div>
      <div style="margin-top:30px;font-weight:bold;">Signature of the Booking Agent / Officer</div>
    </td>
    <td style="width:45%;vertical-align:top;text-align:right;">
      <div style="font-weight:bold;font-size:10px;">For, R.K. CARGO PACKERS & MOVERS</div>
      <div style="margin-top:6px;margin-bottom:4px;display:inline-block;position:relative;">
        <img src="${STAMP_URL}" style="width:90px;height:90px;object-fit:contain;" />
      </div>
      <div style="margin-top:10px;font-weight:bold;">Accountant / Manager Signature</div>
    </td>
  </tr>
</table>

</body></html>`;
}

// ===================== PAGE 3: QUOTATION FRONT (Portrait) =====================
function generateQuotationFront(data: DocData): string {
  const m = data.items?.meta || {};

  const particulars = [
    'i) Packing Charges - (with men and material)',
    'Transportation charges for households (Door to Door / GODn To Gdn)',
    'Loading Charges .......................... Floor',
    'Unloading charges .......................... Floor',
    'Escort with vehicle, his expenses & return fare',
    'Unpacking Charges & Rearranging',
    'Car transportation inclusive of loading & unloading (Insurance by Party)',
    'Octroi Charges / Entry Tax if Applicable',
    'Transit Insurance Premium (Only for accidental risk) of the declarde goods value',
    'Or Carrier risk charge (all risk) of the declared goods value',
    'Storage Charges (per day)',
  ];

  return `<!-- PAGE 1: Quotation Front -->
<div class="page" style="padding:20px 30px;">
  <!-- Header -->
  <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:6px;">
    <img src="${LOGO_URL}" style="width:70px;height:auto;" />
    <div style="flex:1;text-align:center;">
      <div style="font-size:24px;font-weight:900;color:#1a237e;letter-spacing:1px;">R. K. CARGO PACKERS & MOVERS</div>
      <div style="font-size:9px;color:#333;">Office No. 12, Lavkush Complex, Opp. Green Villa, D-Cabin, Sabarmati, Ahmedabad-380019.</div>
      <div style="font-size:9px;color:#333;">M. : 09727807476, 08000141241 &nbsp; www.rkmove.com - email : rkmove84@gmail.com</div>
    </div>
  </div>

  <!-- Ref / Quotation / Date row -->
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;border-top:2px solid #1a237e;border-bottom:2px solid #1a237e;padding:4px 0;">
    <div style="font-size:11px;">Ref. No. : <strong>${data.invoice_number}</strong></div>
    <div style="font-size:16px;font-weight:bold;color:#1a237e;text-decoration:underline;">QUOTATION</div>
    <div style="font-size:11px;">Date : ${fmtDate(data.created_at)}</div>
  </div>

  <!-- To -->
  <div style="font-size:11px;margin-bottom:2px;">To <span style="border-bottom:1px dotted #555;display:inline-block;min-width:500px;padding:0 4px;">${data.customer_name}${data.customer_address ? ', ' + data.customer_address : ''}</span></div>

  <!-- Phone / Appex -->
  <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:11px;">
    <div>Phone No. <span style="border-bottom:1px dotted #555;display:inline-block;min-width:200px;padding:0 4px;">${data.customer_phone || ''}</span></div>
    <div>Appex. Date of Moment <span style="border-bottom:1px dotted #555;display:inline-block;min-width:150px;padding:0 4px;">${m.moment_date || ''}</span></div>
  </div>

  <!-- Dear Sir -->
  <div style="font-size:11px;margin-bottom:2px;">Dear Sir,</div>
  <div style="font-size:10px;margin-bottom:2px;">We thank you for your enquiry for the packing and moving of your belongings from <span style="border-bottom:1px dotted #555;display:inline-block;min-width:100px;padding:0 4px;">${m.from_location || ''}</span> To <span style="border-bottom:1px dotted #555;display:inline-block;min-width:100px;padding:0 4px;">${m.to_location || ''}</span></div>
  <div style="font-size:10px;margin-bottom:8px;">We have pleasure in quoting our charges as follows</div>

  <!-- Particulars Table -->
  <table style="width:100%;border:2px solid #1a237e;border-collapse:collapse;">
    <thead>
      <tr style="background:#e8eaf6;">
        <th style="border:1px solid #1a237e;padding:5px 8px;font-size:11px;width:50px;text-align:center;">S.No.</th>
        <th style="border:1px solid #1a237e;padding:5px 8px;font-size:11px;text-align:center;">PARTICULARS</th>
      </tr>
    </thead>
    <tbody>
      ${particulars.map((p, i) => `<tr>
        <td style="border:1px solid #1a237e;padding:5px 8px;text-align:center;font-size:11px;">${i + 1}</td>
        <td style="border:1px solid #1a237e;padding:5px 8px;font-size:11px;">${p}</td>
      </tr>`).join('')}
      <tr>
        <td colspan="2" style="border:1px solid #1a237e;padding:5px 8px;height:30px;"></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="border:2px solid #1a237e;padding:6px 8px;font-size:13px;font-weight:bold;">TOTAL${data.total_amount ? ' &nbsp;&nbsp;&nbsp; ₹' + Number(data.total_amount).toLocaleString() : ''}</td>
      </tr>
    </tfoot>
  </table>

  <!-- Bottom notes -->
  <div style="margin-top:10px;font-size:9px;line-height:1.7;">
    <div style="margin-bottom:4px;"><span style="display:inline-block;width:18px;text-align:center;">(i)</span> Please to advised that the Lorry transportation charges which quoted are based on the present prevailing rates and will be charged on actual at the time of transportation, Octroi Charges, if applicable will be charged extra as per actual in advance.</div>
    <div style="margin-bottom:4px;"><span style="display:inline-block;width:18px;text-align:center;">(ii)</span> The carrier or their agent shall be exempted 'rom any loss or damage through accident, pilferage, fire, rain, collision any other road or river hazard. We therefore recommend that goods be insured under carrier's risk while carriers risk, no individual policy/receipt from insurance co. will be given.</div>
    <div style="margin-bottom:4px;"><span style="display:inline-block;width:18px;text-align:center;">(iii)</span> PLEASE NOTE THAT THE ABOVE QUOTATION HAS been prepared keeping in view our basic standards of packing with the best packing material as the type of packing will be fit to our discretion.</div>
    <div style="margin-bottom:4px;"><span style="display:inline-block;width:18px;text-align:center;">(iv)</span> We would be grateful if could please be given us one week's advance notice to enable us to commence the above job.</div>
    <div style="margin-bottom:4px;"><span style="display:inline-block;width:18px;text-align:center;">(v)</span> Full Payment at the loading time.</div>
  </div>

  <!-- Signature -->
  <div style="display:flex;justify-content:space-between;margin-top:15px;font-size:11px;">
    <div>
      <div style="font-weight:bold;margin-bottom:3px;">Client's Signature</div>
      <div style="border-bottom:1px solid #555;min-width:180px;height:40px;"></div>
    </div>
    <div style="text-align:right;">
      <div style="font-weight:bold;">For, R. K. CARGO PACKERS & MOVERS</div>
      <img src="${STAMP_URL}" style="width:80px;height:80px;margin-top:5px;" />
    </div>
  </div>

  <!-- Disclaimer -->
  <div style="margin-top:8px;font-size:8px;border-top:1px solid #999;padding-top:4px;color:#555;">
    *Please keep your cash/Jewellary in your custody / lock*<br/>
    Carrying Liquor Gas Cylinder Acid or any type of liquid (Like Ghee tin Oil etc.) is totally PROHIBITED.
  </div>
</div>`;
}

// ===================== PAGE 2: QUOTATION BACK (Terms & Conditions) =====================
function generateQuotationBack(): string {
  return `<!-- PAGE 2: Terms & Conditions -->
<div class="page2" style="page-break-before:always;padding:40px 60px;">
  <h2 style="text-align:center;font-size:20px;font-weight:bold;text-decoration:underline;margin-bottom:25px;color:#1a237e;">TERMS & CONDITIONS</h2>
  <ol style="font-size:12px;line-height:2;padding-left:25px;color:#333;">
    <li>Nature, Contenuts condition and value of the consignment are unknown to Movers here in after called the Corporation. The courtier carries the goods as packed at owner's risk.</li>
    <li>The Company do not guarantee delivery within any specific time and the carriers shall not be liable for any delay in transport of delivery, not due to any negligence of default of the carriers or his agents or servant.</li>
    <li>The Carriers do not them elvers elves responsible in the event of goods being detained to confiscate by the Government authorised for whatever reason.</li>
    <li>The carriers do not themselves responsible for delay in arrival or delivery of goods are destination.</li>
    <li>All goods will be despatched by the carriers at the earliest. Every care will be taken in transporting the goods delivery in good conditions.</li>
    <li>The company shall be not responsible for breakage for any breakable items and leakage of liquid articles.</li>
    <li>The carriers do not hold themselves responsible for any kinds of loss or pilferage caused thought circumstance beyond human control such as whether condition strikes, riotstire and explosive etc.</li>
    <li>The delivery of goods should be taken within 3 days from the date of arrival in ourgodown falling which nominal godown rent @ 50 Per Quintal per day or par there of will be charged and collected.</li>
    <li>Delivery should be taken from ourgodown for all consignments save and except consignment booked specifically as Home delivery.</li>
    <li>If goods are not collected within the free time allowed, will remain at the risk of the owner.</li>
    <li>Every consignment is booked on owner's risk.</li>
    <li>The company shall have the right to dispose of perushalbleslying us delivered after 48 hours of arrival without any notice any other goods after 3 months arrival after due notice in writing to the consignor or consignee or holder interested and the claimant shall be unfilled to the proceeds less freight and demmurange.</li>
    <li>No suit shall be against company i respect of consignments without as claim in writing on the behalf and prefered with in 6 months from the date of bookings.</li>
    <li>The court of BARODA city along shall have jurisdiction in respects of all claims and matter arising under the consignment or the goods entrusted for transport.</li>
    <li>Owner is responsible for wrong declaration of goods prohibited goods.</li>
  </ol>
</div>`;
}

function generateQuotation(data: DocData): string {
  return `<!DOCTYPE html><html><head><title>Quotation - ${data.invoice_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Arial',sans-serif;color:#1a237e;font-size:11px;}
@page{size:portrait;margin:10mm;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
table{border-collapse:collapse;}
</style></head><body>
${generateQuotationFront(data)}
</body></html>`;
}

// ===================== PAGE 4: MONEY RECEIPT =====================
function generateMoneyReceipt(data: DocData): string {
  const m = data.items?.meta || {};

  return `<!DOCTYPE html><html><head><title>Money Receipt - ${data.invoice_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Arial',sans-serif;color:#1a237e;padding:30px 40px;max-width:700px;margin:auto;font-size:13px;}
@page{margin:10mm;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style></head><body>

<!-- Header -->
<div style="display:flex;align-items:flex-start;gap:15px;padding-bottom:12px;border-bottom:3px solid #1a237e;">
  <img src="${LOGO_URL}" style="width:95px;height:auto;" />
  <div>
    <div style="font-size:28px;font-weight:900;color:#1a237e;">R. K. CARGO PACKERS & MOVERS</div>
    <div style="font-size:11px;color:#333;">Office No. 12, Lavkush Complex Opp. Green Villa D-cabin, Sabarmati,</div>
    <div style="font-size:11px;color:#333;">Ahmedabad-380019. <strong>M. : 09727807476, 08000141241</strong></div>
    <div style="font-size:11px;color:#333;"><strong>GSTIN : 24ARXPP9693E1ZV</strong></div>
    <div style="font-size:11px;color:#333;">www.rkmove.com - email : rkmove84@gmail.com.</div>
  </div>
</div>

<!-- Date -->
<div style="text-align:right;margin-top:20px;font-size:14px;font-weight:bold;">Date : <span style="border-bottom:1px solid #333;padding:0 30px;">${fmtDate(data.created_at)}</span></div>

<!-- Receipt Number -->
<div style="margin:20px 0;font-size:16px;font-style:italic;">
  <em>Money Receipt No. : </em><span style="font-size:24px;font-weight:bold;font-style:normal;">${data.invoice_number}</span>
</div>

<!-- Receipt body -->
<div style="font-size:14px;line-height:2.8;font-style:italic;">
  <div><em>Received with thanks from M/s.</em> <span style="border-bottom:1px solid #555;display:inline-block;min-width:350px;padding:0 4px;font-style:normal;font-weight:500;">${data.customer_name}</span></div>
  <div><em>a sum of Rupees</em> <span style="border-bottom:1px solid #555;display:inline-block;min-width:380px;padding:0 4px;font-style:normal;font-weight:500;">${m.amount_words || ''}</span></div>
  <div><em>By Cheque / Cash / D.D. No.</em> <span style="border-bottom:1px solid #555;display:inline-block;min-width:130px;padding:0 4px;font-style:normal;">${m.payment_ref || ''}</span> <em>Dt.</em> <span style="border-bottom:1px solid #555;display:inline-block;min-width:100px;padding:0 4px;font-style:normal;">${m.payment_date || ''}</span> <em>Against</em></div>
  <div><em>our C / N Note / Bill No.</em> <span style="border-bottom:1px solid #555;display:inline-block;min-width:200px;padding:0 4px;font-style:normal;">${m.against_bill || ''}</span> <em>Dt.</em> <span style="border-bottom:1px solid #555;display:inline-block;min-width:100px;padding:0 4px;font-style:normal;">${m.against_date || ''}</span></div>
</div>

<!-- For company -->
<div style="text-align:right;margin-top:25px;font-size:14px;">
  <em>For,</em> <strong>R. K. CARGO PACKERS & MOVERS</strong>
  <br/><img src="${STAMP_URL}" style="width:80px;height:80px;margin-top:5px;" />
</div>

<!-- Rs box -->
<div style="margin-top:30px;display:inline-flex;border:2px solid #1a237e;">
  <div style="background:#1a237e;color:white;padding:8px 14px;font-weight:bold;font-size:18px;">Rs.</div>
  <div style="padding:8px 30px;font-size:20px;font-weight:bold;min-width:180px;">₹${Number(data.total_amount).toLocaleString()}</div>
</div>

</body></html>`;
}

// ===================== PAGE 5: BILL =====================
function generateBill(data: DocData): string {
  const m = data.items?.meta || {};
  const items = Array.isArray(data.items?.line_items) ? data.items.line_items : (Array.isArray(data.items) ? data.items : []);

  // Map the amounts from our 5 fixed fields:
  const freightAmt = items.find((it: any) => it.label === 'Freight')?.amount || '';
  const loadingAmt = items.find((it: any) => it.label === 'Loading charges')?.amount || '';
  const unloadingAmt = items.find((it: any) => it.label === 'Unloding charges')?.amount || '';
  const packingAmt = items.find((it: any) => it.label === 'Packing charges')?.amount || '';
  const insAmt = items.find((it: any) => it.label === 'Ins.')?.amount || '';

  const gstPercent = parseFloat(data.gst_percent) || 0;
  const subtotal = data.subtotal || 0;
  const gstAmount = data.gst_amount || 0;
  const totalAmount = data.total_amount || 0;

  const formatAmtVal = (val: any) => {
    if (val === undefined || val === null || val === '') return '&nbsp;';
    const num = parseFloat(val);
    if (!isNaN(num)) {
      return '₹' + num.toLocaleString();
    }
    return String(val); // returns e.g. "Incl." or "Included"
  };

  return `<!DOCTYPE html><html><head><title>Bill - ${data.invoice_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Arial',sans-serif;color:#1a237e;padding:20px 30px;max-width:800px;margin:auto;font-size:11px;}
@page{margin:10mm;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
table{border-collapse:collapse;width:100%;}
.border-cell {
  border: 1px solid #1a237e;
  padding: 6px;
}
</style></head><body>

<!-- INVOICE label & MOB -->
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;font-weight:bold;font-size:11px;">
  <span style="visibility:hidden;">INVOICE</span>
  <span style="border:2px solid #1a237e;padding:2px 16px;font-size:12px;font-weight:bold;background:#f0f0f8;">INVOICE</span>
  <span style="text-align:right;font-size:10px;">MOB.: 9727807476<br/>08000141241</span>
</div>

<!-- Header with logo -->
<div style="display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #1a237e;padding-bottom:12px;margin-bottom:12px;">
  <div style="display:flex;align-items:center;gap:12px;">
    <img src="${LOGO_URL}" style="width:75px;height:auto;" />
  </div>
  <div style="text-align:right;">
    <div style="font-size:28px;font-weight:900;color:#1a237e;letter-spacing:0.5px;">R. K. <span style="color:#ea580c;">CARGO</span></div>
    <div style="font-size:11px;font-weight:bold;color:#1a237e;letter-spacing:2px;margin-top:2px;border-top:1px solid #cbd5e1;padding-top:4px;">PACKERS AND MOVERS</div>
    <div style="font-size:9px;color:#64748b;margin-top:2px;">📍 Office No G-12, Lavkush Complex, Opp Green Villa, D-Cabin, Sabarmati, Ahmedabad - 380019</div>
  </div>
</div>

<!-- To / Bill No / Date -->
<table style="width:100%;margin-bottom:12px;font-size:12px;">
  <tr>
    <td style="width:70%;vertical-align:bottom;">
      To, <span style="border-bottom:1px dotted #555;display:inline-block;width:80%;padding:0 4px;font-weight:bold;">${data.customer_name}</span>
    </td>
    <td style="width:30%;vertical-align:bottom;text-align:right;">
      Bill No.: <span style="border-bottom:1px dotted #555;display:inline-block;width:60%;padding:0 4px;font-weight:bold;font-size:14px;">${data.invoice_number}</span>
    </td>
  </tr>
  <tr>
    <td style="vertical-align:bottom;padding-top:6px;">
      <span style="border-bottom:1px dotted #555;display:inline-block;width:86%;padding:0 4px;margin-left:22px;">${data.customer_address || ''}</span>
    </td>
    <td style="vertical-align:bottom;text-align:right;padding-top:6px;">
      Date: <span style="border-bottom:1px dotted #555;display:inline-block;width:73%;padding:0 4px;font-weight:bold;">${fmtDate(data.created_at)}</span>
    </td>
  </tr>
</table>

<!-- Bill table -->
<table style="border:2px solid #1a237e;width:100%;">
  <thead>
    <tr style="background:#f0f0f8;">
      <th class="border-cell" style="width:8%;text-align:center;">Sr.No.</th>
      <th class="border-cell" style="width:45%;text-align:center;">Particulars</th>
      <th class="border-cell" style="width:10%;text-align:center;">HSN Code</th>
      <th class="border-cell" style="width:9%;text-align:center;">Weight</th>
      <th class="border-cell" style="width:10%;text-align:center;">Rate</th>
      <th class="border-cell" style="width:18%;text-align:center;">Amount</th>
    </tr>
  </t    <!-- Row 1: Main Particulars & Left Columns + HSN/Weight/Rate values and Freight Charge -->
    <tr>
      <td class="border-cell" rowspan="5" style="text-align:center;vertical-align:top;font-weight:bold;">1</td>
      <td class="border-cell" rowspan="5" style="vertical-align:top;line-height:1.6;font-size:11px;">
        <div style="font-weight:bold;margin-bottom:8px;text-decoration:underline;">Being the Transportation of your Household goods</div>
        <div style="margin-bottom:6px;">From <span style="font-weight:bold;border-bottom:1px solid #555;padding:0 4px;display:inline-block;min-width:200px;">${m.from_location || ''}</span></div>
        <div style="margin-bottom:6px;">To <span style="font-weight:bold;border-bottom:1px solid #555;padding:0 4px;display:inline-block;min-width:200px;">${m.to_location || ''}</span></div>
        <div style="margin-bottom:12px;">Vehicle No. <span style="font-weight:bold;border-bottom:1px solid #555;padding:0 4px;display:inline-block;min-width:180px;">${m.vehicle_number || ''}</span></div>
        <div style="display:flex;gap:20px;font-weight:bold;margin-bottom:20px;">
          <span>[${m.vehicle_type === '2 Wheeler' ? '✔' : ' '}] 2 Wheeler</span>
          <span>[${m.vehicle_type === '4 Wheeler' ? '✔' : ' '}] 4 Wheeler</span>
        </div>
        <div style="margin-top:50px;font-size:10px;color:#333;">
          <div style="font-weight:bold;">PAN No.: <span style="color:#ef4444;">AAOFK7219H</span></div>
          <div style="font-weight:bold;margin-top:2px;">GSTIN : <span style="color:#ef4444;">24ARXPP9693E1ZV</span></div>
        </div>
      </td>
      <td class="border-cell" style="text-align:center;vertical-align:top;font-weight:bold;">${m.HSN_code || '9965'}</td>
      <td class="border-cell" style="text-align:center;vertical-align:top;">${m.weight || ''}</td>
      <td class="border-cell" style="text-align:center;vertical-align:top;">${m.rate || ''}</td>
      <td class="border-cell" style="text-align:right;vertical-align:top;">${formatAmtVal(freightAmt)}</td>
    </tr>
    <!-- Row 2: Loading charges -->
    <tr>
      <td class="border-cell" colspan="3" style="font-weight:semibold;">Loading charges</td>
      <td class="border-cell" style="text-align:right;">${formatAmtVal(loadingAmt)}</td>
    </tr>
    <!-- Row 3: Unloding charges -->
    <tr>
      <td class="border-cell" colspan="3" style="font-weight:semibold;">Unloding charges</td>
      <td class="border-cell" style="text-align:right;">${formatAmtVal(unloadingAmt)}</td>
    </tr>
    <!-- Row 4: Packing charges -->
    <tr>
      <td class="border-cell" colspan="3" style="font-weight:semibold;">Packing charges</td>
      <td class="border-cell" style="text-align:right;">${formatAmtVal(packingAmt)}</td>
    </tr>
    <!-- Row 5: Ins. -->
    <tr>
      <td class="border-cell" colspan="3" style="font-weight:semibold;">Ins.</td>
      <td class="border-cell" style="text-align:right;">${formatAmtVal(insAmt)}</td>
    </tr>
    
    <!-- Row 6: Rupees Words & GST Payable on left, Subtotal/GST/Total on right -->
    <tr>
      <td class="border-cell" colspan="2" rowspan="${gstPercent > 0 ? 3 : 1}" style="vertical-align:top;line-height:1.6;">
        <div style="font-weight:bold;margin-bottom:6px;">GST Payable by: PARTY</div>
        <div style="font-weight:bold;">Rupees (in words):</div>
        <div style="font-style:italic;font-weight:bold;margin-top:4px;word-break:break-word;max-width:350px;">${data.notes || ''}</div>
      </td>
      ${gstPercent > 0 ? `
        <td class="border-cell" colspan="3" style="font-weight:semibold;">Subtotal</td>
        <td class="border-cell" style="text-align:right;font-weight:semibold;">₹${Number(subtotal).toLocaleString()}</td>
      ` : `
        <td class="border-cell" colspan="3" style="font-weight:bold;background:#f0f0f8;">Total</td>
        <td class="border-cell" style="text-align:right;font-weight:bold;background:#f0f0f8;color:#ea580c;">₹${Number(totalAmount).toLocaleString()}</td>
      `}
    </tr>
    
    ${gstPercent > 0 ? `
    <tr>
      <td class="border-cell" colspan="3" style="font-weight:semibold;">GST (${gstPercent}%)</td>
      <td class="border-cell" style="text-align:right;font-weight:semibold;">₹${Number(gstAmount).toLocaleString()}</td>
    </tr>
    <tr>
      <td class="border-cell" colspan="3" style="font-weight:bold;background:#f0f0f8;">Total</td>
      <td class="border-cell" style="text-align:right;font-weight:bold;background:#f0f0f8;color:#ea580c;">₹${Number(totalAmount).toLocaleString()}</td>
    </tr>
    ` : ''}
  </tbody>
</table>

<!-- Footer details -->
<table style="width:100%;margin-top:12px;font-size:11px;">
  <tr>
    <td style="width:55%;vertical-align:top;line-height:1.6;">
      <div style="font-size:10px;color:#444;margin-top:10px;">
        1. Interest @ 18% p.a. will be charged extra, if payment is not received on or before due date.<br/>
        2. Subject to Ahmedabad Jurisdiction.
      </div>
      <div style="margin-top:50px;font-weight:bold;">Receiver's Signature</div>
    </td>
    <td style="width:45%;vertical-align:top;text-align:right;">
      <div style="font-weight:bold;font-size:11px;">For, R.K. CARGO PACKERS & MOVERS</div>
      <div style="margin-top:10px;margin-bottom:6px;display:inline-block;position:relative;">
        <img src="${STAMP_URL}" style="width:110px;height:110px;object-fit:contain;" />
      </div>
      <div style="margin-top:20px;font-weight:bold;">Accountant / Manager</div>
    </td>
  </tr>
</table>

</body></html>`;
}

// Helper to build the 4-column article grid (avoids nested template literal issues)
function buildArticleGrid(articles: any[]): string {
  return [0, 20, 40, 60].map(start => {
    const rows = Array.from({ length: 20 }, (_, i) => {
      const num = start + i + 1;
      const art = articles.find?.((a: any) => a.no === num);
      return '<tr><td style="border:1px solid #1a237e;padding:1px 4px;width:25px;text-align:center;font-size:9px;font-style:italic;">' + num + '</td><td style="border:1px solid #1a237e;padding:1px 4px;font-size:9px;min-width:80px;height:16px;">' + (art?.description || '') + '</td></tr>';
    }).join('');
    return '<table style="flex:1;border:1px solid #1a237e;">' + rows + '</table>';
  }).join('');
}

// ===================== PAGE 6: PACKING LIST =====================
function generatePackingList(data: DocData): string {
  const m = data.items?.meta || {};
  const articles = Array.isArray(data.items?.line_items) ? data.items.line_items : [];

  return `<!DOCTYPE html><html><head><title>Packing List - ${data.invoice_number}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Arial',sans-serif;color:#1a237e;padding:15px 20px;max-width:850px;margin:auto;font-size:11px;}
@page{size:landscape;margin:8mm;}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
table{border-collapse:collapse;}
</style></head><body>

<!-- Header -->
<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
  <img src="${LOGO_URL}" style="width:75px;height:auto;" />
  <div>
    <div style="font-size:28px;font-weight:900;color:#1a237e;">R. K. CARGO PACKERS & MOVERS</div>
    <div style="font-size:9px;color:#333;">Office No. 12, Lavkush Complex, Opp. Green Villa, D-Cabin, Sabarmati, Ahmedabad-380019.</div>
    <div style="font-size:9px;color:#333;">M. : 09727807476, 08000141241 &nbsp; www.rkmove.com - email : rkmove84@gmail.com</div>
  </div>
</div>

<!-- Ref / Date -->
<div style="display:flex;justify-content:space-between;margin-bottom:4px;">
  <div style="font-size:12px;">Our Ref. : <strong style="font-size:18px;">${data.invoice_number}</strong></div>
  <div style="text-align:right;">Date : <span style="border-bottom:1px solid #333;padding:0 30px;">${fmtDate(data.created_at)}</span></div>
</div>
<div style="font-size:11px;margin-bottom:4px;">To <span style="border-bottom:1px dotted #555;display:inline-block;min-width:500px;padding:0 4px;">${data.customer_name}${data.customer_address ? ', ' + data.customer_address : ''}</span></div>

<div style="font-size:11px;margin:8px 0;">Dear Sir,</div>
<div style="font-size:11px;margin-bottom:2px;">We thank for your enquiry for packing and moving of your belongings, From <span style="border-bottom:1px dotted #555;display:inline-block;min-width:150px;padding:0 4px;">${m.from_location || ''}</span> To <span style="border-bottom:1px dotted #555;display:inline-block;min-width:150px;padding:0 4px;">${m.to_location || ''}</span></div>
<div style="font-size:11px;margin-bottom:8px;font-weight:bold;">We have pleasure in quoting our charges as follows :</div>

<div style="text-align:center;font-size:13px;font-weight:bold;text-decoration:underline;margin:8px 0;">ARTICLES DETAILS TO BE PACKING / CARRIED</div>

<!-- 4 column grid: 1-20, 21-40, 41-60, 61-80 -->
<div style="display:flex;gap:0;">
  ${buildArticleGrid(articles)}
</div>

${data.total_amount ? `<div style="text-align:right;margin-top:8px;font-size:13px;font-weight:bold;">Total: ₹${Number(data.total_amount).toLocaleString()}</div>` : ''}
${data.notes ? `<div style="margin-top:4px;font-size:10px;">Note: ${data.notes}</div>` : ''}

<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:15px;font-size:11px;">
  <div>
    <div style="font-weight:bold;">Client's Signature</div>
    <div style="border-bottom:1px solid #555;min-width:180px;height:40px;"></div>
  </div>
  <div style="text-align:right;">
    <div style="font-weight:bold;">For, R. K. CARGO PACKERS & MOVERS</div>
    <img src="${STAMP_URL}" style="width:80px;height:80px;margin-top:5px;" />
  </div>
</div>

</body></html>`;
}

// ===================== DISPATCHER =====================
export function generateDocument(data: DocData): string {
  const docType = data.items?.meta?.doc_type || data.invoice_type || 'Bill';
  switch (docType) {
    case 'LR Copy': return generateLRCopy(data);
    case 'Quotation': return generateQuotation(data);
    case 'Money Receipt': return generateMoneyReceipt(data);
    case 'Packing List': return generatePackingList(data);
    case 'Bill': default: return generateBill(data);
  }
}

export function printDocument(data: DocData) {
  const html = generateDocument(data);
  const w = window.open('', '_blank');
  if (!w) {
    // Fallback: create a blob and download
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.invoice_type || 'document'}-${data.invoice_number || 'draft'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  w.document.write(html);
  w.document.close();
  // Wait for images to load before printing
  const img = w.document.querySelector('img');
  if (img) {
    img.onload = () => setTimeout(() => w.print(), 200);
    img.onerror = () => setTimeout(() => w.print(), 200);
    // Fallback timeout
    setTimeout(() => w.print(), 1500);
  } else {
    setTimeout(() => w.print(), 300);
  }
}