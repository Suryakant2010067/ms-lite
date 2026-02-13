from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/attendance",
    tags=["attendance"],
)

@router.get("/", response_model=List[schemas.Attendance])
def get_attendance(employee_id: Optional[str] = None, db: Session = Depends(database.get_db)):
    query = db.query(
        models.Attendance.id,
        models.Attendance.employee_id,
        models.Attendance.date,
        models.Attendance.status,
        models.Employee.full_name,
        models.Employee.department
    ).join(models.Employee, models.Attendance.employee_id == models.Employee.employee_id)
    
    if employee_id:
        query = query.filter(models.Attendance.employee_id == employee_id)
    
    records = query.order_by(models.Attendance.date.desc()).all()
    
    return [
        schemas.Attendance(
            id=r[0],
            employee_id=r[1],
            date=r[2],
            status=r[3],
            full_name=r[4],
            department=r[5]
        ) for r in records
    ]

@router.post("/", status_code=201)
def mark_attendance(record: schemas.AttendanceCreate, db: Session = Depends(database.get_db)):
    if record.status not in ["Present", "Absent"]:
        raise HTTPException(status_code=400, detail="Status must be 'Present' or 'Absent'")
    
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == record.employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    existing = db.query(models.Attendance).filter(
        models.Attendance.employee_id == record.employee_id,
        models.Attendance.date == record.date
    ).first()
    
    if existing:
        existing.status = record.status
        db.commit()
        return {"message": "Attendance updated successfully"}

    new_record = models.Attendance(**record.dict())
    db.add(new_record)
    db.commit()
    return {"message": "Attendance marked successfully"}
