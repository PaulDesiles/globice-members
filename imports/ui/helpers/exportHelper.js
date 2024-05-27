import { formatDate } from './dateHelper';

const separator = ';';


function launchDownload(header, lines, fileName) {
  const textContent = header + '\n' + lines.join('\n');

  const blob = new Blob(
    [textContent], 
    {type : 'text/plain'}
  );
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
}

export function exportTrips(trips) {
  const lines = trips
    .map(t => 
      formatDate(t.date) + separator
      + t.captain + separator
      + t.type + separator
      + t.port + separator
      + t.renter + separator
      + t.applicants
        .filter(a =>!a.assignedRole)
        .map(a => a.memberName)
        .join(', ')
      + separator
      + t.applicants
        .filter(a =>a.assignedRole)
        .map(a => `${a.memberName} - ${a.assignedRole}`)
        .join(', ')
      + separator
      + (t.fee || '') + separator
      + (t.comment || '')
    );


  launchDownload(
    'date;capitaine;type;port;location;refus;équipage;frais;commentaire',
    lines, 
    'sorties.csv'
  );
}


export function exportMembers(members) {
  const lines = members
    .map(m => 
      m.infos.firstname + separator
      + m.infos.lastname + separator
      + (formatDate(m.infos.birthdate) || '') + separator
      + (m.infos.email || '') + separator
      + (m.infos.phone || '') + separator
      + (m.infos.address || '') + separator
      + (m.infos.postCode || '') + separator
      + (m.infos.city || '') + separator
      // + (m.abilities.boatLicense || '') + separator
      // + (m.abilities.captain || '') + separator
      // + (m.abilities.diving || '') + separator
      + (m.abilities.nemmo || '') + separator
      + (m.abilities.omega || '') + separator
      + (m.abilities.dataManager || '') + separator
      + (m.abilities.photo || '') + separator
      + (m.abilities.comment || '') + separator
      + (formatDate(m.membership.date) || '') + separator
      + (m.membership.isNewMember || '') + separator
      + (m.trips.purchases?.map(p => p.size + ' le ' + formatDate(p.date)).join(', ') || '') + separator
      + (m.trips.confirmedTrips?.map(t => formatDate(t.date)).join(', ') || '') + separator
      + (m.trips.refusedTrips?.map(t => formatDate(t.date)).join(', ') || '')
    );


  launchDownload(
    'prenom;nom;anniversaire;email;telephone;adresse;code postal;ville;réserve NeMMO;formation omega;responsable données;photo;commentaire;adhésion;primo-adhésion;carnets;sorties;refus',
    lines, 
    'benevoles.csv'
  );
}