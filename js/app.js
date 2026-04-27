function setLoading(show) {
  document.getElementById('loadingDiv').classList.toggle('hidden', !show);
  if (show) {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('notFound').classList.add('hidden');
  }
}

async function searchKural() {
  const num = parseInt(document.getElementById('kuralInput').value);
  if (!num || num < 1 || num > 1330) {
    document.getElementById('notFound').classList.remove('hidden');
    document.getElementById('resultSection').classList.add('hidden');
    return;
  }

  setLoading(true);

  try {
    const res  = await fetch(`/api/kural?number=${num}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    showKural(data);
  } catch (err) {
    document.getElementById('notFound').classList.remove('hidden');
    document.getElementById('notFound').querySelector('p').textContent = '❌ பிழை: ' + err.message;
  } finally {
    setLoading(false);
  }
}

function showKural(k) {
  document.getElementById('bookTag').textContent   = k.book;
  document.getElementById('numberTag').textContent = `குறள் ${k.number}`;
  document.getElementById('line1').textContent        = k.line1;
  document.getElementById('line2').textContent        = k.line2;
  document.getElementById('meaning').textContent      = k.meaning;
  document.getElementById('resultSection').classList.remove('hidden');
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('kuralInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') searchKural();
});
