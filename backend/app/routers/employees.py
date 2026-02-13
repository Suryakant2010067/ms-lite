from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database

router = APIRouter(
    prefix="/api/employees",
    tags=["employees"],
)

@router.get("/", response_model=List[schemas.Employee])
def get_employees(db: Session = Depends(database.get_db)):
    return db.query(models.Employee).all()

@router.post("/", status_code=201)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(database.get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee.employee_id).first()
    if db_employee:
        raise HTTPException(status_code=409, detail="Employee ID already exists")
    
    new_employee = models.Employee(**employee.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return {"message": "Employee added successfully"}

@router.delete("/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(database.get_db)):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return {"message": "Employee deleted successfully"}
