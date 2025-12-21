import { supabase } from './supabaseHelper.js'

// Save entry to Supabase
export async function saveToSupabase(entry) {
  try {
    const { error } = await supabase.from('growth_tracker').insert([entry])
    if (error) {
      console.error('Error saving:', error)
    } else {
      console.log('Saved growth entry', entry)
      displayGrowthData()
    }
  } catch (err) {
    console.error('Save failed', err)
  }
}

export async function displayGrowthData() {
  const list = document.getElementById('growth-list')
  if (!list) return // nothing to show

  try {
    const { data, error } = await supabase
      .from('growth_tracker')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching:', error)
      return
    }

    list.innerHTML = ''
    data.forEach(entry => {
      const item = document.createElement('li')
      item.innerHTML = `
        <strong>${entry.date}</strong> — Weight: ${entry.weight} kg, Height: ${entry.height} cm
        ${entry.milestone ? `<br><em>Milestone:</em> ${entry.milestone}` : ''}
      `
      list.appendChild(item)
    })
  } catch (err) {
    console.error('Display failed', err)
  }
}

// Wire up form if present
const form = document.getElementById('tracker-form')
if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault()

    const entry = {
      date: document.getElementById('date')?.value,
      weight: parseFloat(document.getElementById('weight')?.value) || null,
      height: parseFloat(document.getElementById('height')?.value) || null,
      milestone: document.getElementById('milestone')?.value || null,
    }

    await saveToSupabase(entry)
    form.reset()
  })

  // Load entries on page load
  displayGrowthData()
}
