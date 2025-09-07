export interface IBranchMemberRelation {
  childDatabaseName: string;
  child_database_name: string;
  childId: number;
  childParentId: number;
  createdBy: string;
  parentDatabaseName: string;
  parentId: number;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;

  userData?: IBmsUser;
}

export interface ICreateBranchMemberRequest extends IBranchMemberRelation {
  parent_database_name: string;
  child_database_name: string;
  parent_id: number;
  child_id: number;
  priority: number;
}

export interface IBmsUser {
  createdBy: string;
  displayName: string;
  fullName: string;
  priority: number;
  staffCode: string;
  username: string;
  isDisplay: boolean;
  isAvailable: boolean;
  createdAt: string;
  lastModified: string;
  id: number;
}
