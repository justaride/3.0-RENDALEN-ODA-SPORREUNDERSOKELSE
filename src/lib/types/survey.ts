// TypeScript types for Rendalen Boligbehovsundersøkelse

export interface SurveyData {
  metadata: SurveyMetadata;
  sheets: Sheet[];
}

export interface SurveyMetadata {
  source_file: string;
  filepath: string;
  transformed_at: string;
  sheets_count: number;
  transformer_version: string;
}

export interface Sheet {
  sheet_name: string;
  statistics: SheetStatistics;
  responses: Response[];
}

export interface SheetStatistics {
  total_rows: number;
  total_columns: number;
  datetime_fields: number;
  numeric_fields: number;
  text_fields: number;
  multi_select_fields: number;
  null_counts: Record<string, number>;
}

export interface Response {
  response_id: number;
  data: ResponseData;
}

export interface ResponseData {
  metadata: MetadataFields;
  demografi: DemografiFields;
  navaerende_bolig: NavarendeBoligFields;
  omrade_kvalitet: OmradeKvalitetFields;
  arbeid: ArbeidFields;
  diverse: DiverseFields;
  tomt_og_eiendom: TomtOgEiendomFields;
  flytteplaner: FlytteplanerFields;
  boligpreferanser: BoligpreferanserFields;
  tilgjengelighet_helse: TilgjengelighetHelseFields;
  bofellesskap: BofellesskapFields;
  tilleggstjenester: TilleggstjenesterFields;
  hindringer_og_innspill: HindringerOgInnspillFields;
  okonomi: OkonomiFields;
}

// ============================================
// METADATA FIELDS
// ============================================
export interface MetadataFields {
  id: number;
  starttidspunkt: string;
  fullføringstidspunkt: string;
  e_postadresse: string | null;
  navn: string | null;
  tidspunkt_for_siste_endring: string | null;
  hvor_er_din_nåværende_eller_fremtidige_arbeidsplass_hvis_du_søker_arbeid: string | null;
  med_tanke_på_fremtidige_behov_knyttet_til_alder_eller_redusert_helse_hva_er_det_mest_aktuelle_altern: string | null;
  er_det_noen_andre_ting_som_er_viktige_for_deg_ved_valg_av_fremtidig_bosted: string | null;
  har_du_andre_innspill_til_kommunens_arbeid_med_boligpolitikk_boligtilbud_eller_tomteutvikling: string | null;
}

// ============================================
// DEMOGRAFI
// ============================================
export interface DemografiFields {
  hva_er_din_alder: string | null;
  kjønn: string | null;
  hvordan_ser_din_husstand_ut: string | null;
  hvor_mange_barn_bor_i_din_husstand: string | null;
  hva_er_din_livssituasjon: string | null;
  hvilke_aldersgrupper_ønsker_du_å_dele_slike_funksjoner_med: string | null;
}

// ============================================
// NÅVÆRENDE BOLIG
// ============================================
export interface NavarendeBoligFields {
  har_du_registrert_bostedsadresse_i_rendalen_kommune_i_dag: string | null;
  hvor_fornøyd_er_du_med_din_nåværende_bosituasjon: string | null;
  eier_eller_leier_du_boligen_du_bor_i: string | null;
  hva_betaler_du_i_månedsleie_for_din_bolig: string | null;
  leier_du_boligen_din_privat_eller_kommunalt: string | null;
  eier_du_andre_boliger_husmannsplasser_gårdsbruk_som_ikke_lenger_er_i_bruk_og_som_er_ønskelig_å_avhen: string | null;
  eier_dudere_grunn_i_kommunen_hvor_det_kan_være_aktuelt_å_skille_ut_tomt: string | null;
  dersom_du_skulle_leie_bolig_hva_har_du_mulighet_til_å_betale_i_månedsleie: string | null;
}

// ============================================
// OMRÅDE KVALITET (MULTI-SELECT!)
// ============================================
export interface OmradeKvalitetFields {
  // MULTI-SELECT: Semicolon-separated values
  er_det_noe_du_savner_i_området_du_bor_flere_valg_mulig: string | null;
}

// ============================================
// ARBEID
// ============================================
export interface ArbeidFields {
  hvilken_sektor_jobber_du_i: string | null;
  i_hvilken_grad_mener_du_at_mangel_på_passende_boliger_er_en_utfordring_for_å_rekruttere_eller_behold: string | null;
  kunne_du_vurdert_å_flytte_til_rendalen_dersom_en_passende_bolig_og_relevant_jobb_var_tilgjengelig: string | null;
}

// ============================================
// DIVERSE
// ============================================
export interface DiverseFields {
  hva_slags_type_bosted_har_du_nå: string | null;
  hvor_i_rendalen_kommune_bor_du: string | null;
}

// ============================================
// TOMT OG EIENDOM
// ============================================
export interface TomtOgEiendomFields {
  vurderer_eller_ønsker_dudere_å_regulere_tomter_for_å_bygge: string | null;
  er_dudere_aktivt_på_utkikk_etter_boligtomt_i_kommunen: string | null;
  hva_slags_type_tomt_ser_dudere_primært_etter: string | null;
  hvis_du_har_vurdert_å_skille_ut_tomt_hva_er_den_viktigste_årsaken_til_at_det_ikke_har_blitt_gjort: string | null;
  hva_kunne_fått_deg_til_å_realisere_utskillingregulering_av_tomter_på_din_eiendom: string | null;
}

// ============================================
// FLYTTEPLANER (MULTI-SELECT!)
// ============================================
export interface FlytteplanerFields {
  har_du_planer_om_å_flytte_på_deg: string | null;
  // MULTI-SELECT: Semicolon-separated values
  hvor_kunne_du_tenke_deg_å_bo_hvis_du_skulle_flytte_til_eller_innad_i_rendalen_kommune_flere_svar_mul: string | null;
  hvor_langt_er_du_villig_til_å_flytte_på_deg_for_å_bo_i_en_tilpasset_bolig: string | null;
  dersom_tilpasninger_ble_gjort_i_din_bolig_eller_om_dudere_hadde_flyttet_til_en_tilpasset_bolig_ville: string | null;
}

// ============================================
// BOLIGPREFERANSER (MULTI-SELECT!)
// ============================================
export interface BoligpreferanserFields {
  // MULTI-SELECT: Semicolon-separated values
  hvilke_nærmiljøkvaliteter_er_viktigst_for_deg_ved_valg_av_sted_å_bo_flere_valg_mulig: string | null;
  // MULTI-SELECT: Semicolon-separated values
  hvilken_boligtype_er_mest_aktuell_for_deg_ved_en_flytting_flere_svar_mulig: string | null;
  // MULTI-SELECT: Semicolon-separated values
  hvilke_bokvaliteter_er_viktigst_for_deg_ved_valg_av_ny_bolig_flere_valg_mulig: string | null;
  hvor_mange_soverom_har_du_behov_for: string | null;
  ranger_kvaliteter_du_ser_etter_i_en_ny_bolig_dra_og_slipp_de_viktigste_øverst_og_de_minst_viktige_ne: string | null;
}

// ============================================
// TILGJENGELIGHET & HELSE (MULTI-SELECT!)
// ============================================
export interface TilgjengelighetHelseFields {
  // MULTI-SELECT: Semicolon-separated values
  hva_må_tilpasses_eller_oppgraderes_dersom_dudere_skal_bo_lengst_mulig_i_egen_bolig_eller_fikk_reduse: string | null;
  har_du_pårørende_eller_et_nettverk_rundt_deg_som_kunne_hjulpet_med_bosituasjonen_dersom_den_ikke_len: string | null;
  mottar_du_omsorgstjenester_av_kommunen_hjemme_hjemmetjenesten: string | null;
}

// ============================================
// BOFELLESSKAP (MULTI-SELECT!)
// ============================================
export interface BofellesskapFields {
  i_et_bofellesskap_har_du_en_privat_bolig_med_alle_funksjoner_i_tillegg_har_du_fellesarealer_som_kan_: string | null;
  // MULTI-SELECT: Semicolon-separated values
  dersom_det_tilbys_boliger_med_mulighet_for_fellesløsninger_hvilke_tilbud_kunne_vært_relevant_for_deg: string | null;
}

// ============================================
// TILLEGGSTJENESTER (MULTI-SELECT!)
// ============================================
export interface TilleggstjenesterFields {
  // MULTI-SELECT: Semicolon-separated values
  hvilke_tjenester_kunne_du_tenke_deg_å_betale_ekstra_for_enten_direkte_eller_som_del_av_en_felleskost: string | null;
}

// ============================================
// HINDRINGER OG INNSPILL (MULTI-SELECT!)
// ============================================
export interface HindringerOgInnspillFields {
  // MULTI-SELECT: Semicolon-separated values
  for_å_realisere_dine_boligønsker_hva_blir_dine_største_hindringer_flere_svar_mulig: string | null;
}

// ============================================
// ØKONOMI
// ============================================
export interface OkonomiFields {
  dersom_du_skulle_kjøpe_bolig_hva_er_din_anslåtte_maksimale_kjøpesumbyggekostnad: string | null;
  bostøtte_er_en_statlig_støtteordning_for_de_med_lave_inntekter_og_høye_boutgifter_hvilken_av_disse_p: string | null;
  startlån_er_en_statlig_låneordning_for_alle_aldre_for_de_som_ikke_får_lån_i_ordinær_bank_hvilken_av_: string | null;
}

// ============================================
// UTILITY TYPES FOR CHARTS
// ============================================
export interface ChartData {
  name: string;
  value: number;
  count?: number;
  percent?: number;
}

export interface FilterState {
  age: string[];
  gender: string[];
  location: string[];
  householdType: string[];
  economicCapacity: string[];
}

export type DisplayMode = 'percent' | 'count';
export type SortMode = 'natural' | 'popularity' | 'alphabetical';

// ============================================
// CONSTANTS
// ============================================
export const AGE_ORDER = [
  'Under 20 år',
  '20-29 år',
  '30-39 år',
  '40-49 år',
  '50-59 år',
  '60-69 år',
  '70 år eller eldre'
] as const;

export const LOCATION_ORDER = [
  'Bergset',
  'Hanestad',
  'Otnes',
  'Åkrestrømmen',
  'Annet sted i Øvre Rendal',
  'Annet sted i Ytre Rendal'
] as const;
