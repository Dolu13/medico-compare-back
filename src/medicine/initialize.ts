import { PrismaClient } from "@prisma/client";
import path from 'path';
import fs from 'fs-extra';

const prisma = new PrismaClient();
const currentDirectory = path.resolve();

async function loadAutorisationTypeData() {
    const autorisationTypes = await prisma.autorisationType.findMany({
        where: {
            autorisation_Id: { in: [1, 2, 3, 4, 5] }
        }
    });

    if (autorisationTypes.length > 4) {
        console.log('pas d\'autorisation ajouté');
        return;
    }

    const autorisationTypePath = path.join(currentDirectory, 'src', 'medicine','data', 'autorisationTypes.json');
    const data = await fs.readFile(autorisationTypePath, 'utf8');
    const newAutorisationType:{
      "Id": number,
      "Name": string,
    }[] = JSON.parse(data);
  
    for (const autorisation of newAutorisationType) {
      await prisma.autorisationType.create({
        data: {
            autorisation_Id: autorisation.Id,
            name: autorisation.Name,
        }
      });
    }

    console.log('fin de l\'ajout d\'autorisation');
}

async function loadGenericMedicineData() {
    const generic = await prisma.genericMedicine.findFirst();
    if (generic) {
        console.log('pas de générique ajouté');
        return;
    }

    const genericPath = path.join(currentDirectory, 'src', 'medicine', 'data', 'genericMedicine.json');
    const data = await fs.readFile(genericPath, 'utf8');
    const sanitizedData = data.replace(/^\uFEFF/, ''); 

    const newGenerics:{
      "CIS_code": number,
      "name": string,
    }[] = JSON.parse(sanitizedData);
  
    for (const generic of newGenerics) {
        const specificMedicineExists = await prisma.specificMedicine.findUnique({
            where: { CIS_code: generic.CIS_code },
        });

        const genericExists = await prisma.genericMedicine.findUnique({
            where: { CIS_code: generic.CIS_code },
        });

        if (specificMedicineExists && !genericExists) {
            await prisma.genericMedicine.create({
                data: {
                    CIS_code: generic.CIS_code,
                    name: generic.name,
                }
            });
        }
    }
    console.log('fin de l\'ajout de generique');

}

async function loadAvisSMRData() {
    const avisSmr = await prisma.avisSmr.findFirst();
    if (avisSmr) {
        console.log('pas d\'avis SMR ajouté');
        return;
    }

    const avisSmrPath = path.join(currentDirectory, 'src', 'medicine', 'data', 'avis_smr.json');
    const data = await fs.readFile(avisSmrPath, 'utf8');
    const sanitizedData = data.replace(/^\uFEFF/, ''); 

    const newAvisSmr:{
      "CIS_code": number,
      "avis_smr": string,
    }[] = JSON.parse(sanitizedData);
  
    for (const avis of newAvisSmr) {
        const specificMedicineExists = await prisma.specificMedicine.findUnique({
            where: { CIS_code: avis.CIS_code },
        });

        const avisSmrExists = await prisma.avisSmr.findUnique({
            where: { CIS_code: avis.CIS_code },
        });

        if (specificMedicineExists && !avisSmrExists) {
            await prisma.avisSmr.create({
                data: {
                    CIS_code: avis.CIS_code,
                    avis_smr: avis.avis_smr,
                }
            });
        }
    }
    console.log('fin de l\'ajout d\'avis smr');

}

async function loadAvisASMRData() {
    const avisAsmr = await prisma.avisAsmr.findFirst();
    if (avisAsmr) {
        console.log('pas d\'avis ASMR ajouté');
        return;
    }
    const avisAsmrPath = path.join(currentDirectory, 'src', 'medicine','data', 'avis_asmr.json');
    const data = await fs.readFile(avisAsmrPath, 'utf8');
    const sanitizedData = data.replace(/^\uFEFF/, ''); 

    const newAvisAsmr:{
      "CIS_code": number,
      "avis_asmr": string,
    }[] = JSON.parse(sanitizedData);
  
    for (const avis of newAvisAsmr) {
        const specificMedicineExists = await prisma.specificMedicine.findUnique({
            where: { CIS_code: avis.CIS_code },
        });

        const avisAsmrExists = await prisma.avisAsmr.findUnique({
            where: { CIS_code: avis.CIS_code },
        });
        if(specificMedicineExists && !avisAsmrExists)
        await prisma.avisAsmr.create({
            data: {
                CIS_code: avis.CIS_code,
                avis_asmr: avis.avis_asmr,
            }
        });
    }
    console.log('fin de l\'ajout d\'asmr');

}


async function loadSpecificMedicineData() {
    const specificMedicine = await prisma.specificMedicine.findFirst();
    if (specificMedicine) {
        console.log('pas de médicaments ajouté ajouté');
        return;
    }
    const specificMedicinePath = path.join(currentDirectory, 'src', 'medicine','data', 'specificMedicine.json');
    const data = await fs.readFile(specificMedicinePath, 'utf8');
    const newSpecificMedicine:{
      "CIS_code": number,
      "name": string,
      "form": string,
      "administration": string,
      "autorisation": number,
      "commercialized": boolean,
      "AMM_date": string,
      "EU_number": string,
      "company": string,
      "reinforced_surveillance": boolean,
    }[] = JSON.parse(data);
    for (const medicine of newSpecificMedicine) {
        try {
            await prisma.specificMedicine.create({
                data: {
                    CIS_code: medicine["CIS_code"],
                    name: medicine.name,
                    form: medicine.form,
                    administration: medicine.administration,
                    autorisationId: medicine.autorisation,
                    commercialized: medicine.commercialized,
                    AMM_date: medicine["AMM_date"],
                    EU_number: medicine["EU_number"],
                    company: medicine.company,
                    reinforced_surveillance: medicine["reinforced_surveillance"],
                }
            });
        } catch (error) {
            console.error('Erreur lors de l\'insertion du médicament:', medicine, error);
        }
    }
    console.log('fin de l\'ajout de médicaments');

  }

  export async function loadData() {
    try {

         await loadAutorisationTypeData();

         await loadSpecificMedicineData();

         await loadAvisSMRData();

         await loadAvisASMRData();

         await loadGenericMedicineData();
         // vider les tables
         //await prisma.avisSmr.deleteMany();
         //await prisma.avisAsmr.deleteMany();
         //await prisma.specificMedicine.deleteMany();
         //await prisma.autorisationType.deleteMany();
         //await prisma.genericMedicine.deleteMany();
         //console.log('fin de la deletion');

    } catch (error) {
        console.error('Erreur lors du chargement des données', error);
    } finally {
        await prisma.$disconnect();
    }
}
