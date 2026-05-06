# Modèle Relationnel

---

## Table `Utilisateur`
Utilisateur(id: int(3), identifiant: varchar(50), mot_de_passe: varchar(255), nom: varchar(50), prenom: varchar(50), role: enum('ADMIN', 'CONTROLEUR'))  
- **Clé primaire** : id  
- **Clé étrangère** : --  
- **Champ unique** : identifiant  

---

## Table `Train`
Train(id: int(3), nombre_wagons: int, type_train: enum('NIMBUS 4000', 'POUDLARD EXPRESS', 'POUDLARD EXPRESS 2.0'))  
- **Clé primaire** : id  
- **Clé étrangère** : --  
- **Champ unique** : --  

---

## Table `Arret`
Arret(id: int(3), nom: varchar(100), type_arret: enum('DEPART', 'TERMINUS'))  
- **Clé primaire** : id  
- **Clé étrangère** : --  
- **Champ unique** : nom  

---

## Table `Trajet`
Trajet(id: int(3), horaire_depart: datetime, horaire_arrivee: datetime, train_id: int(3), arret_depart_id: int(3), arret_arrivee_id: int(3))  
- **Clé primaire** : id  
- **Clé étrangère** :  
  - train_id fait référence à Train(id)  
  - arret_depart_id fait référence à Arret(id)  
  - arret_arrivee_id fait référence à Arret(id)  
- **Champ unique** : --  

---

## Table `Eleve`
Eleve(id: int(3), nom: varchar(50), prenom: varchar(50), maison: enum('SERDAIGLE', 'GRYFFONDOR', 'SERPENTARD', 'POUFSOUFFLE'))  
- **Clé primaire** : id  
- **Clé étrangère** : --  
- **Champ unique** : --  

---

## Table `Trajet_élève`
Trajet_élève(id: int(3), id_élève: int(3), id_trajet: int(3))  
- **Clé primaire** : id  
- **Clé étrangère** :  
  - id_élève fait référence à Eleve(id)  
  - id_trajet fait référence à Trajet(id)  
- **Champ unique** : --  

---

## 🔗 Clés Étrangères & Contraintes  
- **Utilisateur** : identifiant unique, mot de passe sécurisé.  
- **Train** : lié aux trajets par train_id.  
- **Arret** : utilisé dans les trajets comme point de départ et d'arrivée.  
- **Trajet** : associe un train et deux arrêts avec des horaires.  
- **Eleve** : appartient à une maison spécifique.  
- **Trajet_élève** : relie les élèves aux trajets empruntés.  

---
