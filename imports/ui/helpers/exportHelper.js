import { formatDate } from './dateHelper';

const separator = ';';


function launchDownload(fileContent, fileName) {
    const blob = new Blob(
      [fileContent], 
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
  console.log(trips);

  const data = trips
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

  const textContent = 'date;capitaine;type;port;location;refus;équipage;frais;commentaire\n' + data.join('\n');

  launchDownload(textContent, 'sorties.csv');
}
