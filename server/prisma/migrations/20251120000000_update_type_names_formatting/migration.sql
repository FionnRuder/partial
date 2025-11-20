-- Update existing deliverable type names to formatted versions with spaces and slashes
UPDATE "public"."DeliverableType"
SET "name" = CASE "name"
  WHEN 'SystemSubsystemRequirementsSpecificationSRS' THEN 'System/Subsystem Requirements Specification (SRS)'
  WHEN 'InterfaceControlDocumentICD' THEN 'Interface Control Document (ICD)'
  WHEN 'PreliminaryDesignReviewPDRPackage' THEN 'Preliminary Design Review (PDR) Package'
  WHEN 'RiskFailureModeEffectsAnalysisFMEADFMEAReport' THEN 'Risk/Failure Mode & Effects Analysis (FMEA/DFMEA) Report'
  WHEN 'DevelopmentVerificationPlanVVMatrix' THEN 'Development & Verification Plan / V&V Matrix'
  WHEN 'EngineeringDrawingCADModel' THEN 'Engineering Drawing & CAD Model'
  WHEN 'BillofMaterialsBOM' THEN 'Bill of Materials (BOM)'
  WHEN 'StressStructuralAnalysisReport' THEN 'Stress/Structural Analysis Report'
  WHEN 'ThermalAnalysisReport' THEN 'Thermal Analysis Report'
  WHEN 'ElectricalSchematicsPCBLayouts' THEN 'Electrical Schematics / PCB Layouts'
  WHEN 'DesignforManufacturabilityDFMDesignforTestDFTReviewReport' THEN 'Design for Manufacturability (DFM) & Design for Test (DFT) Review Report'
  WHEN 'CriticalDesignReviewCDRPackage' THEN 'Critical Design Review (CDR) Package'
  WHEN 'WorkInstructionsAssemblyProcedures' THEN 'Work Instructions / Assembly Procedures'
  WHEN 'FirstArticleInspectionFAIReport' THEN 'First Article Inspection (FAI) Report'
  WHEN 'SupplierQualityRecordsCertificatesofConformanceCoC' THEN 'Supplier Quality Records / Certificates of Conformance (CoC)'
  WHEN 'TestPlansandProcedures' THEN 'Test Plans and Procedures'
  WHEN 'QualificationTestReport' THEN 'Qualification Test Report'
  WHEN 'AcceptanceTestProcedureATPReport' THEN 'Acceptance Test Procedure (ATP) & Report'
  WHEN 'CalibrationCertificates' THEN 'Calibration Certificates'
  WHEN 'NonConformanceCorrectiveActionReportNCRCAR' THEN 'Non-Conformance / Corrective Action Report (NCR/CAR)'
  WHEN 'RequirementsVerificationReport' THEN 'Requirements Verification Report'
  WHEN 'AsBuiltConfigurationEndItemDataPackage' THEN 'As-Built Configuration / End-Item Data Package'
  WHEN 'UserOperationsManual' THEN 'User / Operations Manual'
  WHEN 'MaintenanceRepairManualSparePartsList' THEN 'Maintenance & Repair Manual / Spare Parts List'
  WHEN 'CertificatesofCompliance' THEN 'Certificates of Compliance'
  WHEN 'LessonsLearnedPostProjectReport' THEN 'Lessons-Learned & Post-Project Report'
  ELSE "name"
END
WHERE "name" IN (
  'SystemSubsystemRequirementsSpecificationSRS',
  'InterfaceControlDocumentICD',
  'PreliminaryDesignReviewPDRPackage',
  'RiskFailureModeEffectsAnalysisFMEADFMEAReport',
  'DevelopmentVerificationPlanVVMatrix',
  'EngineeringDrawingCADModel',
  'BillofMaterialsBOM',
  'StressStructuralAnalysisReport',
  'ThermalAnalysisReport',
  'ElectricalSchematicsPCBLayouts',
  'DesignforManufacturabilityDFMDesignforTestDFTReviewReport',
  'CriticalDesignReviewCDRPackage',
  'WorkInstructionsAssemblyProcedures',
  'FirstArticleInspectionFAIReport',
  'SupplierQualityRecordsCertificatesofConformanceCoC',
  'TestPlansandProcedures',
  'QualificationTestReport',
  'AcceptanceTestProcedureATPReport',
  'CalibrationCertificates',
  'NonConformanceCorrectiveActionReportNCRCAR',
  'RequirementsVerificationReport',
  'AsBuiltConfigurationEndItemDataPackage',
  'UserOperationsManual',
  'MaintenanceRepairManualSparePartsList',
  'CertificatesofCompliance',
  'LessonsLearnedPostProjectReport'
);

-- Update existing issue type names to formatted versions with spaces and slashes
UPDATE "public"."IssueType"
SET "name" = CASE "name"
  WHEN 'RequirementWaiver' THEN 'Requirement Waiver'
  WHEN 'NonConformanceReportNCR' THEN 'Non-Conformance Report (NCR)'
  WHEN 'ProcessManufacturingIssue' THEN 'Process / Manufacturing Issue'
  WHEN 'SupplyChainProcurementIssue' THEN 'Supply-Chain / Procurement Issue'
  WHEN 'IntegrationInterfaceIssue' THEN 'Integration / Interface Issue'
  WHEN 'TestVerificationAnomaly' THEN 'Test / Verification Anomaly'
  WHEN 'EnvironmentalReliabilityIssue' THEN 'Environmental / Reliability Issue'
  WHEN 'ConfigurationDocumentationControlIssue' THEN 'Configuration / Documentation Control Issue'
  WHEN 'SafetyRegulatoryIssue' THEN 'Safety / Regulatory Issue'
  WHEN 'ProgrammaticRiskItem' THEN 'Programmatic / Risk Item'
  WHEN 'ObsolescenceEndOfLifeIssue' THEN 'Obsolescence / End-of-Life Issue'
  ELSE "name"
END
WHERE "name" IN (
  'RequirementWaiver',
  'NonConformanceReportNCR',
  'ProcessManufacturingIssue',
  'SupplyChainProcurementIssue',
  'IntegrationInterfaceIssue',
  'TestVerificationAnomaly',
  'EnvironmentalReliabilityIssue',
  'ConfigurationDocumentationControlIssue',
  'SafetyRegulatoryIssue',
  'ProgrammaticRiskItem',
  'ObsolescenceEndOfLifeIssue'
);

