from pydantic import BaseModel, EmailStr
from typing import Optional, List

class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: str
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class Employee(EmployeeBase):
    id: int

    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    employee_id: str
    date: str
    status: str

class AttendanceCreate(AttendanceBase):
    pass

class Attendance(AttendanceBase):
    id: int
    full_name: Optional[str] = None
    department: Optional[str] = None

    class Config:
        from_attributes = True
