# Weak Electric Room Lists Design

## Scope

Update only the left-side weak-electric overview panels in `Big Screen/weak-electric.html`. Keep the building scene, floor-plan interaction, right-side dashboards, and bottom subsystem navigation unchanged.

## Data

Generate 25 mock locations from buildings 1 through 5 and floors 1F through 5F.

- Weak shaft name: `厦门金山财富中心{building}栋{floor}弱电井`
- Weak equipment room name: `厦门金山财富中心{building}栋{floor}弱电机房`
- Each location uses deterministic mock values for device count, online count, offline count, fault count, temperature, humidity, daily electricity use, and duty status.

## Weak Shaft List

Rename `弱电并列表` to `弱电井列表`. Show two fixed vertical cards matching the supplied blue dashboard reference, without a selector or table header. Each card displays the full weak-shaft location name followed by device count, online count, offline count, fault count, and a right-arrow button. Clicking either arrow advances both cards to the next two locations; the 25 locations wrap continuously after the final item.

## Weak Equipment Room List

Keep the title `弱电机房列表`. Add a selector containing all 25 equipment-room names. Show the selected room's position, running state, temperature, humidity, daily electricity use, and duty status. Replace the right-side `在线` label with a right-arrow button. The arrow advances to the next room and wraps after the final item.

## Interaction

The equipment-room selector updates only its own panel. Either weak-shaft arrow advances the two-card group by two records. Rendering is initialized whenever `系统总览` is selected. Controls remain keyboard accessible and include descriptive labels.

## Verification

- The data set contains exactly 25 weak-shaft and 25 equipment-room names covering buildings 1-5 and floors 1F-5F.
- The weak-shaft panel shows exactly two cards with full location names and four status metrics.
- Clicking either weak-shaft arrow advances both cards as one group and wraps correctly.
- No right-side `在线` action label remains in either list card.
- Selector and arrow interactions update the displayed location without affecting the building or floor-plan state.
- No mojibake is introduced in the edited HTML, CSS, or JavaScript.
