import InvoiceSession1 from '../../components/accountant/InvoiceSession1';
import InvoiceSession2 from '../../components/accountant/InvoiceSession2';
import InvoiceSession3 from '../../components/accountant/InvoiceSession3';
import InvoiceSession4 from '../../components/accountant/InvoiceSession4';
import React from 'react';
const Invoice = () => {
  return (
    <div className="space-y-6 py-6">
      <InvoiceSession1 />
      <InvoiceSession2 />
      <InvoiceSession3 />
      <InvoiceSession4 />
    </div>
  );
};

export default Invoice;

