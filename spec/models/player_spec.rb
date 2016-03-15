require 'rails_helper'

describe Player, type: :model do
  describe '.compare_players' do
    let(:player_one){ [2,4] }
    let(:player_two){ [3,5] }
    let(:player_three){ [4,6] }
    it 'returns the closest' do
      expect(Player.compare_players([player_one, player_two, player_three])).to eq([player_one, player_two])
    end
  end
end
