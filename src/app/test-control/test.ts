export interface Test {

  name: string;
  owner: string;
  time: string;
  state: string;

  test_adimlari?: string;
  kabul_kriteri?: string;
  durum?: string;


}

export interface Step{
  name: string;

}