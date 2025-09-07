export interface IBranchTable {
  areaId: number;
  name: string;
  capacity: number;
  priority: number;
  shape: string;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;
}

export interface IBranchArea {
  name: string;
  capacity: number;
  priority: number;
  shape: string;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;
}
