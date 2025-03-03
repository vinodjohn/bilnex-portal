export class GenResponseList {
  objList: any[] = [];
  currentPage: number;
  totalElements: number;

  constructor(objList: any[], currentPage: number, totalElements: number) {
    this.objList = objList;
    this.currentPage = currentPage;
    this.totalElements = totalElements;
  }
}
