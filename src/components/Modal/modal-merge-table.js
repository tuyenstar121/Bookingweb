
import React from 'react';
import { Modal } from 'react-bootstrap';

function MergeTableModal({
  isShowMergeTable, 
  setIsShowMergeTable, 
  selectedTable, 
  tables,
  handleMergeTable 
}) {

  const handleClose = () => setIsShowMergeTable(false);

  

  return (
    <>
      <Modal 
        show={isShowMergeTable} 
        onHide={handleClose} 
        centered 
    >
        <Modal.Header closeButton className='bg-[#27E140]'>
            <Modal.Title className=''>
                <div className='text-white text-xl'>
                    Gộp bàn {selectedTable?.tableNumber} với bàn:
                </div>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-4 gap-4">
            {tables.map((table) => (
              <div 
                key={table.tableId} 
                className="relative border cursor-pointer border-gray-300 rounded-md text-center h-[64px]"
                onClick={()=>handleMergeTable(table)}
              >
                <div className="font-bold">{table.tableNumber}</div>
                <div className={`absolute left-0 bottom-0 w-full rounded-b ${table.status === 'occupied' ? 'bg-gray-600 text-white' : 'bg-green-500 text-white'}`}>
                  {table.status==='occupied'?'Đã có khách':'Bàn trống'}
                </div>
              </div>
            
            ))}
          </div>
        </Modal.Body>
        
      </Modal>
    </>
  );
}

export default MergeTableModal;
